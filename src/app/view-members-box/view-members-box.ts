import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users-service';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-view-members-box',
  templateUrl: './view-members-box.html',
  styleUrls: ['./view-members-box.css']
})
export class ViewMembersBox implements OnInit {
  members: User[];
  admins: User[];
  userInView: User;
  membersInDisplay: User[];
  adminsInDisplay: User[];
  searchText: string = '';
  currentOrg: string = 'mca';


  constructor(private auth: AuthService, private afs: AngularFirestore) {
    var adminsValueChangesRef = this.afs.collection('orgs/'+this.currentOrg+'/admins').valueChanges();
    var usersValueChangesRef = this.afs.collection('orgs/'+this.currentOrg+'/users').valueChanges();
    
    usersValueChangesRef.subscribe(users=>{
      this.members = users;
      if(this.members){
        this.membersInDisplay = this.searchInArray(this.members);
        this.userInView = this.members[0];
      }
    })

    adminsValueChangesRef.subscribe(admins=>{
      this.admins = admins;
      if(this.admins){
        this.adminsInDisplay = this.searchInArray(this.admins);
      }
    })
  }
 
  ngOnInit(){
  }

  handleClick(user: User){
    this.userInView = user;
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
}


export class AppComponent {

 }
