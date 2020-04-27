import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { org } from '../models/org'
import { User } from '../models/user'
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-org-pro-dashboard',
  templateUrl: './org-pro-dashboard.component.html',
  styleUrls: ['./org-pro-dashboard.component.css']
})
export class OrgProDashboardComponent implements OnInit {

  @Output() orgChanged = new EventEmitter<string>();
  user: User;
  orgs: org[];
  userEmail: string;

  constructor(private auth: AuthService) {
    this.userEmail = auth.afAuth.auth.currentUser.email;
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

  getOrgs(){

    this.auth.afs.doc<User>('allUsers/' + this.userEmail)
     .valueChanges()
     .subscribe(data=>{
         var orgRoleMap = data.orgRole;

         var orgsArray = [];
        
          for(let org in orgRoleMap){
            console.log(org);
            console.log(orgRoleMap[org]);

            orgsArray.push({
              id:org,
              role: orgRoleMap[org]
            });
          }
          this.orgs = orgsArray;
          console.log("From getOrgs");
          console.log(this.orgs);
        })
    // console.log(this.orgs);
    //this.orgChanged.emit(this.orgs[0].id);
  }
}
