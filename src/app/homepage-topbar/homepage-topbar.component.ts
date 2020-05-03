import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { org } from '../models/org';
import 'rxjs/add/operator/map';



export interface OrgRole{
  id: string,
  name: string
}

@Component({
  selector: 'app-homepage-topbar',
  templateUrl: './homepage-topbar.component.html',
  styleUrls: ['./homepage-topbar.component.css']
})
export class HomepageTopbarComponent implements OnInit {
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

  @Output() orgChanged = new EventEmitter<string>();
  user: User;
  orgs: org[];
  userEmail: string;
  
  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.afAuth.auth.currentUser != null)
      this.userLoggedIn = true
      
    this.userEmail = auth.afAuth.auth.currentUser.email;
    this.orgs = [];
    
    this.orgsCollection = this.auth.afs.collection<OrgRole>('allUsers/'+this.userEmail+'/orgs');

    this.getOrgs();
    }
  ngOnInit(): void {
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
    console.log("Kishor");
    this.currentOrg = orgName
    console.log("org change event reached dashboard " + this.currentOrg);
  }
  isHomeRoute() {
    return this.router.url === '/dashboard'
  }
  signOut(){
    this.auth.signOut();
  }

}
