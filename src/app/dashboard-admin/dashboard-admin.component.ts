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
          window.alert("this user already exists in users table");
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
            }
          });
        }
      });

  }
}
