import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { org } from '../models/org'
import { User } from '../models/user'
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

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
  private orgsCollection: AngularFirestoreCollection<OrgRole>;
  items: Observable<OrgRole[]>;

  @Output() orgChanged = new EventEmitter<string>();
  user: User;
  orgs: org[];
  userEmail: string;

  constructor(private auth: AuthService) {
    this.userEmail = auth.afAuth.auth.currentUser.email;
    this.orgs = [];
    
    this.orgsCollection = this.auth.afs.collection<OrgRole>('allUsers/'+this.userEmail+'/orgs');

    this.getOrgs();
    // if(this.orgs){
    //   this.orgChanged.emit(this.orgs[0].id);
    // }
  
  }

  ngOnInit(): void {
  }

  // For switching orgs
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
  
}
