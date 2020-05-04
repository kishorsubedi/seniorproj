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
  org: string;
}

const SAMPLE_DATA: AttendedEvents[] = [
  {date: "Sample Date", title: "Sample Title", org: "Sample Org"},
  {date: "Sample Date2", title: "Sample Title2", org: "Sample Org2"},
];

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @Input() orgInView: string;

  async ngOnChanges(changes: any) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'orgInView': {
            if (this.orgInView){
              console.log("Type of OIV ngOnChan: ", this.orgInView);
              console.log("atEvents be nOC:  ", this.atEvents);
              this.isFirstDataLoaded = false;
              console.log("val of first Num 1: ", this.isFirstDataLoaded);
              await this.getEvents(this.orgInView);
              this.dataSource = new MatTableDataSource(this.atEvents);
              console.log("atEvents af nOC:  ", this.atEvents);

              this.isFirstDataLoaded = true;
              console.log("case be del:  ", this.atEvents);
              console.log("val of first Num 2: ", this.isFirstDataLoaded);
              this.atEvents = [];
              
              console.log("case af del:  ", this.atEvents);


            }
            /* console.log("case be del:  ", this.atEvents);
            this.dataSource = new MatTableDataSource(this.atEvents);
            console.log("val of first Num 2: ", this.isFirstDataLoaded);
            this.atEvents = [];
            console.log("case af del:  ", this.atEvents); */
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
  //@ViewChild('eventTable',{static:true}) table: MatTable<AttendedEvents>;
   
  // where i use the AuthService for the email.
  constructor(private auth: AuthService,
    private usersService: UsersService,
    private afStorage: AngularFireStorage) { 

    this.userEmail = auth.afAuth.auth.currentUser.email;
    //this.userName = auth.afAuth.auth.currentUser.displayName;

    if(this.orgInView) {
      this.printOrg();
    }
    console.log("Be con: ");
    //this.getEvents(this.orgInView);
    console.log("atEvents be con:  ", this.atEvents);
    //this.dataSource = new MatTableDataSource(this.atEvents);
    console.log("atEvents af con:  ", this.atEvents);

    this.getUserName();
    this.downloadImage();
    console.log("OIV ConS: ", this.orgInView);
  }

  ngOnInit() {
    //this.getEvents(this.orgInView);
    this.dataSource.sort = this.sort;
  }

  printOrg() {
    console.log("print Org func: ", this.orgInView);
  }

  ngAfterViewInit() {
    //this.getEvents(this.orgInView);
    this.dataSource.sort = this.sort;
  }

  async getEvents(org: string){
    await this.usersService.getEvents(org).then(events => {       
      for (var key in events) {
        this.currEven = {date: events[key].date,
                        title: events[key].title,
                        org: events[key].org};

        console.log("curr even in getEvents: ", this.currEven);       
        this.atEvents.push(this.currEven);        
      }
    });
    // Testing ngAfterViewInit
    
    //this.dataSource = new MatTableDataSource(this.atEvents);
    //this.table.renderRows();
    //this.atEvents = [];
    //console.log("cleared events");
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
