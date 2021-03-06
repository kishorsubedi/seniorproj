import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  format,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';  
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import {  OnInit, Input } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../services/auth.service';
import { ActionSequence } from 'protractor';
import { Action } from 'rxjs/internal/scheduler/Action';
import { MatDialog } from '@angular/material/dialog';
import { WindowScrollController } from '@fullcalendar/core';
import { UsersService } from '../services/users-service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: [ './calendar-view.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class CalendarViewComponent {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild('modalEdit', { static: true }) modalEdit: TemplateRef<any>;
  @ViewChild('modalAdd', { static: true }) modalAdd: TemplateRef<any>;

  @Input() orgInView: string = '';

  async ngOnChanges(changes: any) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'orgInView': {
            if (this.orgInView){
              await this.isAdmin(this.orgInView);
              this.getEvents();
            }
          }
        }
      }
    }
  }

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  Admin = false;

  modalData: {
    action: string;
    event: CalendarEvent;
    startString? : string;
    endString? : string;
  };

  adminActions: CalendarEventAction[] = [
    {
      label: 'Edit ',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.openEditDialog(event);
      },
    },
    {
      label: 'Delete ',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        //this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleDelete(event);
      },
    }
  ]

  rsvpAction: CalendarEventAction = {
      label: 'RSVP ',
      a11yLabel: 'rsvp',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        //this.events = this.events.filter((iEvent) => iEvent !== event);
        this.rsvpToEvent(event);
      },  
    };

  cancelRsvpAction: CalendarEventAction = {
    label: 'Cancel RSVP ',
    a11yLabel: 'cancel rsvp',
    onClick: ({ event }: { event: CalendarEvent }): void => {
      //this.events = this.events.filter((iEvent) => iEvent !== event);
      this.cancelRsvpToEvent(event);
    },  
  };

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[];

  activeDayIsOpen: boolean = true;

  // For adding events
  newEventTitle: string = "";
  newEventStart: string = this.viewDate.toISOString().slice(0,10).replace(new RegExp("-", "g"),'/');;
  newEventEnd: string = "";
  newEventStartTime: string = "";
  newEventEndTime: string = "";
  newEventLocation: string = "";
  newEventDescription: string= "";

  // For Editing events
  editEventId: string = "";
  editEventTitle: string = "";
  editEventStart: string = "";
  editEventEnd: string = "";
  editEventStartTime: string = "";
  editEventEndTime: string = "";
  editEventLocation: string = "";
  editEventDescription: string= "";

  constructor(private user:UsersService, private modal: NgbModal, private afs:AngularFirestore, private auth:AuthService, private dialog:MatDialog) {
  }

  // Gets events of current org from the database
  async getEvents(){
    if(this.orgInView){
      var eventsValueChangesRef = this.afs.collection('orgs/'+this.orgInView+'/events').valueChanges();
      await eventsValueChangesRef.subscribe(events=>{
        if(events){
          var duplicateEvents = [];
          duplicateEvents = events;
        } 
        for(var event of duplicateEvents){
            if(this.Admin){
              event.actions = [...this.adminActions];  
            }
            else{
              event.actions = [];
            }
            // If the user has not rsvp yet
            if(event.rsvpMembers.indexOf(this.auth.currentUser.email) == -1){
              event.actions.push(this.rsvpAction);
            }
            else{
              event.actions.push(this.cancelRsvpAction);
            }
            event.startString = event.start
            event.start = new Date(event.start);
            if(event.end){
              event.endString = event.end
              event.end = new Date(event.end);
            }
        }
      if(events){
        this.events =duplicateEvents;
      }
      })
    }
  }

  // When a particular day is clicked on calendar
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
      this.newEventStart = this.viewDate.toISOString().slice(0,10).replace(new RegExp("-", "g"),'/');
    }
  }

  //
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
  }

  async handleDelete(event) {
      if (window.confirm("Confirm that you want to delete this event")){
        //await this.afs.collection("orgs/"+ this.orgInView + "/events").doc(event.id).set({});
        await this.afs.collection("orgs/"+ this.orgInView + "/events").doc(event.id).delete();
        window.alert("This event is deleted")
      }
    }
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });


  openEditDialog(event){
    this.editEventTitle  = event.title;
    this.editEventId = event.id;
    this.editEventStart = event.start.toISOString().slice(0,10).replace(new RegExp("-", "g"),'/');
    if(event.end){
      this.editEventEnd = event.end.toISOString().slice(0,10).replace(new RegExp("-", "g"),'/');
    }
    else{
      this.editEventEnd = event.end;
    }
    this.editEventStartTime = event.startTime;
    this.editEventEndTime = event.endTime;
    this.editEventLocation = event.location;
    this.editEventDescription = event.description;

    this.dialog.open(this.modalEdit);
  }

  openAddDialog(){
    this.dialog.open(this.modalAdd);
  }

  async confirmEdit(){
    if(window.confirm("Please confirm that you want to make these changes")){
      await this.afs.collection('orgs/'+this.orgInView + "/events").doc(this.editEventId).update({
        title: this.editEventTitle,
        start: this.editEventStart,
        end: this.editEventEnd,
        startTime: this.editEventStartTime,
        endTime: this.editEventEndTime,
        location: this.editEventLocation,
        description: this.editEventDescription
      });
      window.alert("Changes to the event made.");
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    if(action == 'Clicked')
    {
      if(event.start){
        this.modalData.startString = event.start.toISOString().slice(0,10).replace(new RegExp("-", "g"),'/')
      }
      if(event.end){
        this.modalData.endString = event.end.toISOString().slice(0,10).replace(new RegExp("-", "g"),'/')
      }
    }
    this.dialog.open(this.modalContent);
  }

  async addEvent() {
    if(this.orgInView){
      if(window.confirm("Please confirm you want to add this event.")){
        var randomId = UUID.UUID();
        var eventsCollectionRef = this.afs.firestore.collection("orgs").doc(this.orgInView).collection("events")
        await eventsCollectionRef.doc(randomId).set({
          id: randomId,
          title: this.newEventTitle,
          start: this.newEventStart,
          end: this.newEventEnd,
          startTime: this.newEventStartTime,
          endTime: this.newEventEndTime,
          location: this.newEventLocation,
          description: this.newEventDescription,
          creator: this.auth.currentUser.email,
          rsvpMembers: [],
        })
        window.alert("The event is successfully added.")
      }
    }
    this.newEventTitle = "";
    this.newEventStart = "";
    this.newEventEnd = "";
    this.newEventStartTime = "";
    this.newEventEndTime = "";
    this.newEventLocation = "";
    this.newEventDescription = "";
  }

  async rsvpToEvent(event){
     // If the user has already rsvp
    if(event.rsvpMembers.indexOf(this.auth.currentUser) > -1){
      window.alert("You have already registered to this event");
    }
    else{
      if(window.confirm("Please confirm that you want to RSVP to this event")){
        console.log("Name is ",this.user.getUserName())
        event.rsvpMembers.push(this.auth.currentUser.email);
        await this.afs.collection('orgs/'+this.orgInView + "/events").doc(event.id).update({
          rsvpMembers: event.rsvpMembers
        });
        await this.afs.collection('allUsers/'+ this.auth.currentUser.email + '/orgs/' + this.orgInView + '/rsvpEvents').doc(event.id).set({});
        window.alert("Your RSVP is received");
      }
    }
  }

  async cancelRsvpToEvent(event){
    // If the user has already rsvp
   if(event.rsvpMembers.indexOf(this.auth.currentUser.email) == -1){
     window.alert("You have not registered for this event yet");
   }
   else{
     if(window.confirm("Please confirm that you want to cancel RSVP to this event")){
        event.rsvpMembers.splice(event.rsvpMembers.indexOf(this.auth.currentUser.email),1);
        await this.afs.collection('orgs/'+this.orgInView + "/events").doc(event.id).update({
          rsvpMembers: event.rsvpMembers
        });
        await this.afs.collection('allUsers/'+ this.auth.currentUser.email + '/orgs/' + this.orgInView + '/rsvpEvents').doc(event.id).delete();
        window.alert("Your RSVP is canceled");
     }
   }
 }

 async isAdmin(org:string){
  var orgAdminRef = this.auth.afs.firestore.doc("orgs/"+org+"/admins/"+this.auth.afAuth.auth.currentUser.email);
  var doc = await orgAdminRef.get();
  if(doc.data()){
    this.Admin = true;
    console.log("From calendar: this is an admin")
  }
  else{
    this.Admin = false;
    console.log("From calendar: this is not an adimn")
  }

  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
