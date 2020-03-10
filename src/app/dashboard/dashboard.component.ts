import { Component, OnInit } from '@angular/core';
import { DashboardAdminComponent } from '../dashboard-admin/dashboard-admin.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  Admin = false;

  constructor(private auth: AuthService, private router: Router) { 
    this.isAdmin();
  }

  ngOnInit(): void {
  }

  async isAdmin(){
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

  signOut(){
    this.auth.signOut();
  }
}


