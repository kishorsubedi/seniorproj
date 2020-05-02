import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UsersService } from '../services/users-service';

export interface AttendedEvents {
  date: string;
  title: string;
  org: string;
}

const EVENT_DATA: AttendedEvents[] = [
  {date:'04/03/2020', title: 'Bit Awards', org: 'ACM'},
  {date:'10/15/2020', title: 'Byte@Night', org: 'ACM'},
  {date:'08/27/2020', title: 'GBM', org: 'ACM'},
  {date:'09/03/2020', title: 'Git Work Shop', org: 'ACM'},
  {date:'04/25/2020', title: 'Meet&Greet', org: 'ACM'},
  {date:'05/18/2020', title: 'Networking Workshop', org: 'ACM'},
  {date:'07/25/2020', title: 'Eminado', org: 'ACM'},
  {date:'11/18/2020', title: 'Ma Lo', org: 'ACM'},
  {date:'12/25/2020', title: 'sici', org: 'ACM'},
  {date:'02/18/2020', title: 'soco Lo', org: 'ACM'},
]

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  displayedColumns: string[] = ['date', 'title', 'org'];
  dataSource = new MatTableDataSource(EVENT_DATA);
  userName: string;
  userEmail: string;
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  
  // where i use the AuthService for the email.
  constructor(private auth: AuthService,
    private users: UsersService) { 

    this.userEmail = auth.afAuth.auth.currentUser.email;
    // this.userName = this.getUserName();

    console.log("logging: ", typeof this.users.getUserName() );

    this.users.getEvents();
    this.users.getUserName().then(res => {
      this.userName = res;
    });
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
  }

  getEvents(){
    this.users.getEvents();
  }

  getOrgs(){
    this.users.getOrgs();
  }

  /*getUserName(){
    this.users.getUserName();
  }*/

}
