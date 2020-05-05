import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UsersService } from '../services/users-service';
import { AngularFireStorage } from 'angularfire2/storage';
import { Url } from 'url';
import { Observable } from 'rxjs';

export interface AttendedEvents {
  date: string;
  title: string;
  location: string;
}

// const SAMPLE_DATA: AttendedEvents[] = [
//   {date: "Sample Date", title: "Sample Title", org: "Sample Org"},
//   {date: "Sample Date2", title: "Sample Title2", org: "Sample Org2"},
// ];

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @Input() orgInView: string;

  // Updates the event table when the organization's are changed.
  async ngOnChanges(changes: any) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'orgInView': {
            if (this.orgInView){
              await this.getEvents(this.orgInView);
              this.dataSource = new MatTableDataSource(this.atEvents);
              this.atEvents = [];
            }
          }
        }
      }
    }
  }

  downloadURL: Observable<any[]>;
  atEvents: AttendedEvents[] = [];
  displayedColumns: string[] = ['date', 'title', 'org'];
  dataSource = new MatTableDataSource<AttendedEvents>();
  userName: string;
  userEmail: string;
  currEven: AttendedEvents;

  isFirstDataLoaded = true;


  @ViewChild(MatSort, {static: true}) sort: MatSort;
   
  // where i use the AuthService for the email.
  constructor(private auth: AuthService,
    private usersService: UsersService,
    private afStorage: AngularFireStorage) { 

    this.userEmail = auth.afAuth.auth.currentUser.email;

    this.getUserName();
    this.downloadImage();
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  // loops through each event, creates an eventClass, and addds it to the event list. 
  async getEvents(org: string){
    await this.usersService.getEvents(org).then(async events => {       
      for (var key in events) {
        await this.usersService._getEvents(key, org).then(res => {
          this.currEven = res;
        })      
        this.atEvents.push(this.currEven);        
      }
    });
  }

  // gets the display username from the database
  getUserName(){
    this.usersService.getUserName().then(res => {
      this.userName = res;
    });
  }

  // gets the profile pic from the database
  async downloadImage(){
    this.downloadURL = await this.afStorage.ref("profilePictures/"+this.userEmail).getDownloadURL();
  }

  // uploads a profile pic to the database.
  async upload(event) {
    if(event.target.files[0]){
      var ref = this.afStorage.ref("profilePictures/"+this.userEmail);
      // the put method creates an AngularFireUploadTask
      // and kicks off the upload
      await ref.put(event.target.files[0]); //upload
      this.downloadImage();
    }
  }

}
