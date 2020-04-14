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
  invited: User[];
  userInView: User;
  membersInDisplay: User[];
  adminsInDisplay: User[];
  searchText: string;


  constructor(private usersService: UsersService, private auth: AuthService) {
    this.usersService.getMembers().subscribe(members=>{
      this.members = members;
      this.membersInDisplay = this.searchInArray(this.members);
      if(members != []){
        this.userInView = this.members[0];
      }
    })
    this.usersService.getAdmins().subscribe(admins=>{
      this.admins = admins;
      this.adminsInDisplay = this.searchInArray(this.admins);
    })
    this.usersService.getInvitedUsers().subscribe(invited=>{
      this.invited = invited;
    });

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
        if(user.email.search(this.searchText) != -1){
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
}

export class AppComponent {

 }