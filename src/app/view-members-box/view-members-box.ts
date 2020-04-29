import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service'; 
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-view-members-box',
  templateUrl: './view-members-box.html',
  styleUrls: ['./view-members-box.css']
})
export class ViewMembersBox implements OnInit {
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

  constructor(private auth: AuthService, private afs: AngularFirestore) {
    if(this.orgInView){
      this.isAdmin(this.orgInView);
    }
  }
 
  ngOnInit(){
  }

  handleUserClick(user: User){
    this.userInView = user;
  }


  // Updates the users and members list
  async updateUsersList(){
    var adminsValueChangesRef = this.afs.collection('orgs/'+this.orgInView+'/admins').valueChanges();
    var usersValueChangesRef = this.afs.collection('orgs/'+this.orgInView+'/users').valueChanges();
    
    await usersValueChangesRef.subscribe(async members=>{
      if(members){
        // eha garne ho 
        this.members = members;
      } 

      if(this.members){
        this.membersInDisplay = this.searchInArray(this.members);
        this.userInView = this.members[0];
      }
    })

    await adminsValueChangesRef.subscribe(admins=>{
      if(admins){
        this.admins = admins;
      }
      if(this.admins){
        this.userInView = admins[0];
        console.log(this.userInView.email);
        this.adminsInDisplay = this.searchInArray(this.admins);
      }
    })
  }

  searchInArray(users: User[]){
    let result: User[];
    result = [];
    for(var user of users){
      if(user.email != null){
        if(user.email.toLowerCase().search(this.searchText.toLowerCase()) != -1){
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
