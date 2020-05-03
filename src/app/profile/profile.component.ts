import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UsersService } from '../services/users-service';
import { AngularFireStorage } from 'angularfire2/storage';
import { Url } from 'url';
import { Observable } from 'rxjs';

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

  downloadURL: Observable<any[]>;
  displayedColumns: string[] = ['date', 'title', 'org'];
  dataSource = new MatTableDataSource(EVENT_DATA);
  userName: string;
  userEmail: string;
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  
  // where i use the AuthService for the email.
  constructor(private auth: AuthService,
    private usersService: UsersService,
    private afStorage: AngularFireStorage) { 

    this.userEmail = auth.afAuth.auth.currentUser.email;
    //this.userName = auth.afAuth.auth.currentUser.displayName;

    this.usersService.getEvents();
    this.downloadImage();
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
  }

  getEvents(){
    this.usersService.getEvents();
  }

  getOrgs(){
    this.usersService.getOrgs();
  }

  getUserName(){
    this.usersService.getUserName();
  }

  async downloadImage(){
    this.downloadURL = await this.afStorage.ref("profilePictures/"+this.auth.currentUser.email).getDownloadURL();
  }

  async upload(event) {
    if(event.target.files[0]){
      var ref = this.afStorage.ref("profilePictures/"+this.auth.currentUser.email);
      // the put method creates an AngularFireUploadTask
      // and kicks off the upload
      await ref.put(event.target.files[0]); //upload
      this.downloadImage();
    }
  }

}
