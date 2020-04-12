import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
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
