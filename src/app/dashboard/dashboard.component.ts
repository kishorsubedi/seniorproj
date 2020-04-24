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
  loadStripe() {
     
    if(!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://checkout.stripe.com/checkout.js";
      window.document.body.appendChild(s);
    }
}

  ngOnInit() {
    this.loadStripe()
  }
  pay(amount) {    
 
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_aeUUjYYcx4XNfKVW60pmHTtI',
      locale: 'auto',
      token: function (token: any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        console.log(token)
        alert('Token Created!!');
      }
    });
 
    handler.open({
      name: 'Pay Your ACM Dues',
      description: 'thank you for your commitment!',
      amount: amount * 100
    });
 
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


