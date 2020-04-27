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
        console.log(data.belongsTo);
         var orgsStringArray = data.belongsTo;
         var orgsArray = [];
        
          var num = 0
          while(num < orgsStringArray.length){
            orgsArray.push({id: orgsStringArray[num]});
            num +=1;
          }
          this.orgs = orgsArray;
          this.orgChanged.emit(this.orgs[0].id);
        })
    // console.log(this.orgs);
    //this.orgChanged.emit(this.orgs[0].id);
  }
}
