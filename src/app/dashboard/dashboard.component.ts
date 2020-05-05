import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { orgdashboardComponent } from '../orgdashboard/orgdashboard.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { OrgProDashboardComponent } from '../org-pro-dashboard/org-pro-dashboard.component';
import { MatSidenav } from '@angular/material/sidenav';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, Subject } from 'rxjs';
import { User } from 'firebase';
import { org } from '../models/org';

export interface OrgRole{
  id: string,
  name: string
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }
  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
  currentOrg : string;
  userLoggedIn: boolean = false

  private orgsCollection: AngularFirestoreCollection<OrgRole>;
  items: Observable<OrgRole[]>;
  needToChooseOrg: boolean;

  @Output() orgChanged = new EventEmitter<string>();
  user: User;
  orgs: org[];
  userEmail: string;

  constructor(private auth: AuthService, private router: Router) { 
    if (this.auth.afAuth.auth.currentUser != null){
      this.needToChooseOrg = true;

      console.log("kii");
      this.userLoggedIn = true
  
      this.userEmail = auth.afAuth.auth.currentUser.email;
      this.orgs = [];
      
      this.orgsCollection = this.auth.afs.collection<OrgRole>('allUsers/'+this.userEmail+'/orgs');
  
      this.getOrgs();
    }
    
  }

  orgToChoose(){
    this.needToChooseOrg = true;
    document.getElementById("orgdashboard").style.opacity = "0.2";
  }

  orgChose(){
    this.needToChooseOrg = false;
    document.getElementById("orgdashboard").style.opacity = "1";
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

  handleOrgClick(orgName: string){
    this.orgChanged.emit(orgName);
  }

  navigateToOrgDashboard() {  
    console.log("Lets navigate to specific org");
  }

  orgsWatcher(){
    return this.auth.afs.doc('allUsers/'+this.userEmail).valueChanges();
  }

async getOrgs(){

    // const x = await this.auth.afs.firestore.doc('/allUsers/'+ this.userEmail + '/orgs/neworg').get()
    // const data = x.data();
    // console.log(data);
    // console.log("LAAMO");

    this.auth.afs.collection<OrgRole>('allUsers/' + this.userEmail + '/orgs')
     .valueChanges()
     .subscribe(data=>{
          this.orgs = data;
          this.orgChanged.emit(this.orgs[0].id);
        })
  }

  handleOrgChange(orgName){
    this.currentOrg = orgName
    console.log("org change event reached dashboard " + this.currentOrg);
  }

  handleOrgChangeClicked(orgName){
    this.orgChose();
  }

  isHomeRoute() {
    return this.router.url === '/dashboard'
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
  
  signOut(){
    this.auth.signOut();
  }
}



