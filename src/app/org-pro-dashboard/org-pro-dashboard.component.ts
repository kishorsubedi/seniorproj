import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { org } from '../models/org'
import { User } from '../models/user'
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { MatSidenav } from '@angular/material/sidenav';

export interface OrgRole{
  id: string,
  name: string
}

@Component({
  selector: 'app-org-pro-dashboard',
  templateUrl: './org-pro-dashboard.component.html',
  styleUrls: ['./org-pro-dashboard.component.css']
})
export class OrgProDashboardComponent implements OnInit {
  userName: any;

  async getUserName(userEmail: string){
    var userDocRef = this.auth.afs.firestore.doc("allUsers/"+userEmail);
    this.userName = await userDocRef.get().then(await function(doc) {
      if (doc.exists) {
          return doc.data().name;
      }
      else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
  }

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

  private orgsCollection: AngularFirestoreCollection<OrgRole>;
  items: Observable<OrgRole[]>;

  @Output() orgChanged = new EventEmitter<string>();
  @Output() orgChangedClicked = new EventEmitter<string>();

  user: User;
  orgs: org[];
  userEmail: string;

  constructor(private auth: AuthService) {
    this.userEmail = auth.afAuth.auth.currentUser.email;
    this.orgs = [];
    
    this.orgsCollection = this.auth.afs.collection<OrgRole>('allUsers/'+this.userEmail+'/orgs');

    this.getOrgs();
    this.userName = this.getUserName(this.userEmail);
    // if(this.orgs){
    //   this.orgChanged.emit(this.orgs[0].id);
    // }
  
  }

  ngOnInit(): void {
  }

  // For switching orgs
  handleOrgClick(orgName: string){
    this.orgChangedClicked.emit(orgName);
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
  
}
