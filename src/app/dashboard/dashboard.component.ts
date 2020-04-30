import { Component, OnInit } from '@angular/core';
import { orgdashboardComponent } from '../orgdashboard/orgdashboard.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { OrgProDashboardComponent } from '../org-pro-dashboard/org-pro-dashboard.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentOrg : string;

  constructor(private auth: AuthService, private router: Router) { 

  }

  ngOnInit(): void {
 
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


