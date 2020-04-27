import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service'; 

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
            console.log("ngOnChanges called updateUsersList called");
            this.updateUsersList("from ngonchanges");
            console.log("ngonchanges called, updatedUsersList ");
          }
        }
      }
    }
  }

  aw = false;
  Admin:boolean = false;
  members: User[];
  admins: User[];
  userInView: User;
  membersInDisplay: User[];
  adminsInDisplay: User[];
  searchText: string = '';


  constructor(private auth: AuthService, private afs: AngularFirestore) {
    console.log("MOFO");
    //var adminsValueChangesRef = this.afs.collection('orgs/'+this.orgInView+'/admins').valueChanges();
    this.updateUsersList("from constructor");
  }
 
  ngOnInit(){
  }

  handleUserClick(user: User){
    this.userInView = user;
  }


  // Updates the users and members list
  async updateUsersList(from?: string){
    // const snapshot = await this.afs.collection("orgs").doc("this.orgInView").collection("admins").get();
    // console.log(snapshot.forEach(child=>{
    //   console.log(child); 
    // }));
    console.log("updatesuserslist called" + from);

    var adminsValueChangesRef = this.afs.collection('orgs/'+this.orgInView+'/admins').valueChanges();
    var usersValueChangesRef = this.afs.collection('orgs/'+this.orgInView+'/users').valueChanges();
    
    await usersValueChangesRef.subscribe(members=>{
      console.log("usersValueChangesRef called");
      this.members = members;
      console.log("this.members");
      console.log(this.members);
      if(this.members){
        this.membersInDisplay = this.searchInArray(this.members);
        this.userInView = this.members[0];
      }
    })

    await adminsValueChangesRef.subscribe(admins=>{
      console.log("adminsValueChangesRef called");
      this.admins = admins;
      if(this.admins){
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

  inviteMember(inviteEmail: string){

    this.auth.afs.firestore.doc('/users/'+ inviteEmail).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          // do something
          window.alert("User already a member!");
        }
        else{
          this.auth.afs.firestore.doc('/invitedMembers/'+ inviteEmail).get()
          .then(docSnapshot => {
            if (docSnapshot.exists) {
              // do something
              window.alert("this user is already invited!");
            }
            else{
                var inviteMembersCollectionRef = this.auth.afs.collection('invitedMembers'); // a ref to the users collection
                inviteMembersCollectionRef.doc(inviteEmail).set({ email: inviteEmail });
                window.alert("User invited");
            }
          });
        }
      });

  }

  makeAdmin(makeAdminEmail: string)
  {
    //is admin ? yes window.alert("Already an admin");
    //No, then if user-> make. no -> have to be an user.
    this.auth.afs.firestore.doc('/admins/'+ makeAdminEmail).get()
          .then(docSnapshot => {
              if (docSnapshot.exists) {
                // do something
                window.alert("Already an admin!");
              }
              else{
                    
                  this.auth.afs.firestore.doc('/users/'+ makeAdminEmail).get()
                .then(docSnapshot => {
                    if (docSnapshot.exists) {
                      // make adminn
                      var adminsCollectionRef = this.auth.afs.collection('admins'); // a ref to the users collection
                      adminsCollectionRef.doc(makeAdminEmail).set({ email: makeAdminEmail });
                      
                      this.auth.afs.firestore.doc(`users/${makeAdminEmail}`).delete();
                    }
                    else{
                        window.alert("Have to be an user!");
                    }
                });

              }
          });
  }

  demoteAdmin(email?: string){
    this.auth.afs.firestore.doc('/admins/'+ email).get()
          .then(docSnapshot => {
              if (docSnapshot.exists) {
                this.auth.createUser("", email);
                this.auth.afs.firestore.doc(`admins/${email}`).delete();
                window.alert(email + " stripped of their admin privilege succesfully!");
              }
              else{
                window.alert("Not an admin!");
              }
          });
  }

  removeMember(email?: string){
    this.auth.afs.firestore.doc('/users/'+ email).get()
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
    if (window.confirm("Are you sure you want to strip their admin privilege?")) { 
      if (email){
        this.demoteAdmin(email);
      }
      else{
        this.demoteAdmin(this.userInView.email);
      }
    }
  }

  confirmRemoveMember(email?: string){
    if (window.confirm("Are you sure you want to remove this member?")) { 
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
    if (window.confirm("Are you sure you want to make this member an admin?")) { 
      if (email){
        this.makeAdmin(email);
      }
      else{
        this.makeAdmin(this.userInView.email);
      }
    }
  }

  confirmInviteMember(email: string){
    if (window.confirm("Are you sure you want to invite this user to join OrgPro?")) { 
      console.log(email);
      this.inviteMember(email);
    }
  }

  isAdmin(){
    // var currUid = this.auth.afAuth.auth.currentUser.uid;
    var currEmail = this.auth.afAuth.auth.currentUser.email;
    this.auth.afs.firestore.doc('/admins/'+ currEmail).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          this.Admin = true;
          console.log("this is an admin!");
        }
        else{
          this.Admin = false;
          console.log("this is not an admin!");
        }
      });
  }

}


export class AppComponent {

 }
