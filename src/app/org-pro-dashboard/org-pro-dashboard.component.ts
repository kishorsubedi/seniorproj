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

  @Output() currentOrg = new EventEmitter<string>();
  user: User;
  orgs: org[];
  userEmail: string;

  constructor(private auth: AuthService) {
    this.userEmail = auth.afAuth.auth.currentUser.email;
    this.getOrgs();
  }

  ngOnInit(): void {
  }

  // For switching orgs
  handleOrgClick(orgName: string){
    console.log("org clicked "+orgName);
    this.currentOrg.emit(orgName);
  }

  navigateToOrgDashboard() {
    console.log("Lets navigate to specific org");
  }

  orgsWatcher(){
    return this.auth.afs.doc('allUsers/'+this.userEmail).valueChanges();
  }

  getOrgs(){
    console.log("GETTING ORGS of this user");
    console.log(this.auth.afAuth.auth.currentUser.email);

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
          console.log(this.orgs);
        })
  }
}
