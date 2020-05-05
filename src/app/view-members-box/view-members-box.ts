import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service'; 
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AngularFireStorage } from 'angularfire2/storage';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from '../services/users-service';

export interface AttendedEvents {
  date: string;
  title: string;
  location: string;
}

@Component({
  selector: 'app-view-members-box',
  templateUrl: './view-members-box.html',
  styleUrls: ['./view-members-box.css']
})
export class ViewMembersBox implements OnInit {

  downloadURL: Observable<any[]>;
  @Input()  orgInView: string ;
  
  ngOnChanges(changes: any) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'orgInView': {
            if (this.orgInView){
              this.updateUsersList();
              this.isAdmin(this.orgInView);
            }
          }
        }
      }
    }
  }
  Admin: Subject<boolean> = new Subject();

  members: User[] = [];
  admins: User[] = [];
  userInView: User;
  membersInDisplay: User[];
  adminsInDisplay: User[];
  searchText: string = '';
  currEven: AttendedEvents;

  atEvents: AttendedEvents[] = [];
  displayedColumns: string[] = ['date', 'title', 'org'];
  dataSource = new MatTableDataSource<AttendedEvents>();

  constructor(private auth: AuthService, private afs: AngularFirestore, private afStorage: AngularFireStorage, private usersService: UsersService) {
    //observable to allusers/userEmail/orgs/org . once it changes, call isAdmin. it hides the admin view itself
    if(this.orgInView){
      this.isAdmin(this.orgInView);
    }
    if(this.userInView){
      this.downloadImage();
    }
   
    console.log("Admin", this.Admin);
    // if(document.getElementById('adminList')){
    //   console.log("Adminlist element fetched")
    //   document.getElementById('adminList').style.height = '100px';
    // }
  }
 
  ngOnInit(){
  }

  async handleUserClick(user: User){
    this.userInView = user;

    await this.getEvents(this.userInView.email);
    this.dataSource = new MatTableDataSource(this.atEvents);
    this.atEvents = [];

    this.downloadImage();
  }

  async getEvents(userEmail: string){
    await this.usersService.getEvents(this.orgInView, userEmail).then(async events => {       
      for (var key in events) {
        await this.usersService._getEvents(key, this.orgInView).then(res => {
          this.currEven = res;
        })      
        this.atEvents.push(this.currEven);        
      }
    });
  }

  async downloadImage(){
    console.log("dsd");
    this.downloadURL = await this.afStorage.ref("profilePictures/"+this.userInView.email).getDownloadURL();
  }


  // Updates the users and members list
  async updateUsersList(){
    var adminsValueChangesRef = this.afs.collection <User>('orgs/'+this.orgInView+'/admins').valueChanges();
    var usersValueChangesRef = this.afs.collection <User>('orgs/'+this.orgInView+'/users').valueChanges();
    
    await usersValueChangesRef.subscribe(async members => {
      if(members){
        // eha garne ho 
        this.members = members;
      } 

      if(this.members){
        this.membersInDisplay = this.searchInArray(this.members);
      }
      //console.log("This.members: ",this.members);
    })

    await adminsValueChangesRef.subscribe(async admins=>{
      if(admins){
        this.admins = admins;
      }
      if(this.admins){
        for(let admin of this.admins){
          if(admin.name){
            this.userInView = admin;

            await this.getEvents(this.userInView.email);
            this.dataSource = new MatTableDataSource(this.atEvents);
            this.atEvents = [];

            break;
          }
        }
        //console.log(admins);
        //this.userInView = admins[0];
        await this.downloadImage();
        this.adminsInDisplay = this.searchInArray(this.admins);
      }
    })
  }

  searchInArray(users: User[]){
    let result: User[];
    result = [];
    for(var user of users){
      if(user.name != null){
        if(user.name.toLowerCase().search(this.searchText.toLowerCase()) != -1){
          result.push(user)
        }
      }
    }
    return result;
    }

  // Updates adminsInDisplay and membersInDisplay when searchText changes
  updateInDisplay(){
    this.adminsInDisplay = this.searchInArray(this.admins);
    this.membersInDisplay = this.searchInArray(this.members);
  }

  inviteMember(inviteEmail: string, org: string){

    this.auth.afs.firestore.doc('/orgs/'+ org + '/users/' + inviteEmail).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          // do something
          window.alert("User already a member!");
        }
        else{
          this.auth.afs.firestore.doc('orgs/' + org + '/admins/' + inviteEmail).get()
          .then(docSnapshot => {
            if (docSnapshot.exists) {
              // do something
              window.alert("this user is already an admin in this org!");
            }
            else{

              this.auth.afs.firestore.doc('orgs/' + org + '/invitedMembers/' + inviteEmail).get()
              .then(docSnapshot => {
                if (docSnapshot.exists) {
                  // do something
                  window.alert("this user is already invited!");
                }
                else{

                  this.auth.afs.firestore.doc('allUsers/' + inviteEmail).get()
                  .then(docSnapshot => {
                    if (docSnapshot.exists) {
                      // do something
                      window.alert("this user is already an OrgPro member. Sending a notification!");
                      //allUsers/user.pendingInvite.add();
                      var allUsersCollectionRef = this.auth.afs.collection('allUsers/' + inviteEmail + '/pendingInvites/'); // a ref to the users collection
                      try {
                        allUsersCollectionRef.doc(org).set({});
                      }
                      catch(error) {
                        //pendingInvites collection doesn't exist.
                        console.error(error);
                        // expected output: ReferenceError: nonExistentFunction is not defined
                        // Note - error messages will vary depending on browser
                      }
                    }
                    else{
                        window.alert("User invited. Pending their sign up!");
                    }
                    var inviteMembersCollectionRef = this.auth.afs.collection('orgs/' + org + '/invitedMembers/'); // a ref to the users collection
                    inviteMembersCollectionRef.doc(inviteEmail).set({ email: inviteEmail });
                  });

                }
              });
            
            }
          });
        }
      });

  }

  makeAdmin(makeAdminEmail: string, makeAdminName: string, org: string)
  {
    //is admin ? yes window.alert("Already an admin");
    //No, then if user-> make. no -> have to be an user.
    this.auth.afs.firestore.doc('/orgs/'+ org + '/admins/' + makeAdminEmail).get()
          .then(docSnapshot => {
              if (docSnapshot.exists) {
                // do something
                window.alert("Already an admin!");
              }
              else{
                  this.auth.afs.firestore.doc('/orgs/'+ org + '/users/'+ makeAdminEmail).get()
                .then(docSnapshot => {
                    if (docSnapshot.exists) {
                      // make adminn
                      var adminsCollectionRef = this.auth.afs.collection('/orgs/'+ org + '/admins'); // a ref to the users collection
                      adminsCollectionRef.doc(makeAdminEmail).set({ email: makeAdminEmail, name: makeAdminName });
                      
                      this.auth.afs.firestore.doc(`orgs/${org}/users/${makeAdminEmail}`).delete();

                      var usersOrgCollectionRef = this.afs.collection('allUsers/'+makeAdminEmail+'/orgs/'); // a ref to the users collection
                      usersOrgCollectionRef.doc(org).update({ role: 'admin' });
                    }
                    else{
                        window.alert("Have to be an user!");
                    }
                });

              }
          });
  }

  demoteAdmin(email: string){
    console.log(email);
    this.auth.afs.firestore.doc('/orgs/'+this.orgInView+ '/admins/'+ email).get()
          .then(docSnapshot => {
              if (docSnapshot.exists) {
                this.auth.createUser("", email, this.userInView.name, this.orgInView);
                this.auth.afs.firestore.doc(`/orgs/${this.orgInView}/admins/${email}`).delete();
                window.alert(email + " stripped of their admin privilege succesfully!");
              }
              else{
                window.alert("Not an admin!");
              }
          });
  }

  removeMember(email?: string){
    this.auth.afs.firestore.doc('/allUsers/'+ email).get()
          .then(docSnapshot => {
              if (docSnapshot.exists) {
                this.auth.afs.firestore.doc(`users/${email}`).delete();
                window.alert(email + " removed succesfully!");
              }
              else{
                window.alert("Not a member!");
              }
          });
  }

  confirmDemoteAdmin(email?: string){
    if (!email){
      email = this.userInView.email;
    }
    if (window.confirm("Are you sure you want to strip " + email +  " their admin privilege?")) { 
      if (email){
        this.demoteAdmin(email);
      }
      else{
        this.demoteAdmin(this.userInView.email);
      }
    }
  }

  confirmRemoveMember(email?: string){
    if (!email){
      email = this.userInView.email;
    }
    if (window.confirm("Are you sure you want to remove " + email +  " from member?")) { 
      if (email){
        this.removeMember(email);
      }
      else{
        this.removeMember(this.userInView.email);
      }
    }
  }

  // This functions displays a window asking the admin to confirm an make admin operation. 
  // If the user selects OK make admin is carried out. 
  confirmMakeAdmin(email?: string){
    if (!email){
      email = this.userInView.email;
    }
    if (window.confirm("Are you sure you want to make " + email +  " an admin?")) { 
      if (email){
        this.makeAdmin(email, this.userInView.name, this.orgInView);
      }
      else{
        this.makeAdmin(this.userInView.email, this.userInView.name, this.orgInView);
      }
    }
  }

  confirmInviteMember(email: string){
    if (!email){
      email = this.userInView.email;
    }
    if (window.confirm("Are you sure you want to invite " + email +  " to join OrgPro?")) { 
      console.log(email);
      this.inviteMember(email, this.orgInView);
    }
  }

  isAdmin(org:string){
    // var currUid = this.auth.afAuth.auth.currentUser.uid;
    var currEmail = this.auth.afAuth.auth.currentUser.email;
    console.log("HU"+ currEmail);
    console.log("HU"+ org);
    this.auth.afs.firestore.doc('/orgs/'+ org +'/admins/'+currEmail).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          this.Admin.next(true);
          console.log("this is an admin!");
        }
        else{
          this.Admin.next(false);
          console.log("this is not an admin!");
        }
      });
  }
}


export class AppComponent {

 }
