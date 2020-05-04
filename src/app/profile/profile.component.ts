import { Component, OnInit, ViewChild, Input } from '@angular/core';
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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  downloadURL: Observable<any[]>;
  atEvents: AttendedEvents[] = [];
  displayedColumns: string[] = ['date', 'title', 'org'];
  dataSource = new MatTableDataSource();
  userName: string;
  userEmail: string;
  currEven: AttendedEvents;

  @Input() orgInView: string = '';

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  
  // where i use the AuthService for the email.
  constructor(private auth: AuthService,
    private usersService: UsersService,
    private afStorage: AngularFireStorage) { 

    this.userEmail = auth.afAuth.auth.currentUser.email;
    //this.userName = auth.afAuth.auth.currentUser.displayName;

    this.getEvents();
    this.dataSource = new MatTableDataSource(this.atEvents);
    this.getUserName();
    this.downloadImage();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {    
    this.dataSource.sort = this.sort;
  }

  /* 
  ngOnChanges(changes: any) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'orgInView': {
            if (this.orgInView){
              this.getEvents(this.orgInView);
              this.dataSource = new MatTableDataSource(this.atEvents);
            }
          }
        }
      }
    }
  } */

  async getEvents(){
    this.usersService.getEvents().then(events => {       
      for (var key in events) {
        console.log("type of date: ", events[key].date );
        this.currEven = {date: events[key].date,
                        title: events[key].title,
                        org: events[key].org};

        console.log("curr even in getEvents: ", this.currEven);
        console.log("in get events: orginal" );        
        this.atEvents.push(this.currEven);        
      }
    });
    // Testing ngAfterViewInit
    this.dataSource.data = this.atEvents;
  }

  getOrgs(){
    this.usersService.getOrgs();
  }

  getUserName(){
    this.usersService.getUserName().then(res => {
      this.userName = res;
    });
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
