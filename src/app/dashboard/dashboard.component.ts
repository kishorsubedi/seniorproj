import { Component, OnInit } from '@angular/core';
import { orgdashboardComponent } from '../orgdashboard/orgdashboard.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentOrg : string;

  constructor(private auth: AuthService, private router: Router) { 

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

  ngOnInit(): void {
 
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


  handleOrgChange(orgName){
    console.log("Kishor");
    this.currentOrg = orgName
    console.log("org change event reached dashboard " + this.currentOrg);
  }
  
  signOut(){
    this.auth.signOut();
  }
}


