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

  ngOnChanges(changes: any) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'orgInView': {
            if (this.orgInView){
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

  modalData: {
    action: string;
    event: CalendarEvent;
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
  newEventStart: string = "";
  newEventEnd: string = "";
  newEventLocation: string = "";
  newEventDescription: string= "";

  // For Editing events
  editEventId: string = "";
  editEventTitle: string = "";
  editEventStart: string = "";
  editEventEnd: string = "";
  editEventLocation: string = "";
  editEventDescription: string= "";

  constructor(private modal: NgbModal, private afs:AngularFirestore, private auth:AuthService, private dialog:MatDialog) {
    //console.log("Current user", auth.currentUser.email);
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
          event.actions = [...this.adminActions];  //Add an if(admin)
          // If the user has not rsvped yet
          if(event.rsvpedMembers.indexOf(this.auth.currentUser.email) == -1){
            //console.log("Entered if")
            event.actions.push(this.rsvpAction);
          }
          else{
            event.actions.push(this.cancelRsvpAction);
          }
          event.start = new Date(event.start);
          if(event.end){
            event.end = new Date(event.end);
          }
        }

        this.events =duplicateEvents;
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
    this.editEventStart = event.start;
    this.editEventEnd = event.end;
    this.editEventLocation = event.location;
    this.editEventDescription = event.description;

    this.modal.open(this.modalEdit, { size: 'lg' });
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
        location: this.editEventLocation,
        description: this.editEventDescription
      });
      window.alert("Changes to the event made.");
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.dialog.open(this.modalContent);
  }

  addEvent(): void {
    if(this.orgInView){
      var randomId = UUID.UUID();
      var eventsCollectionRef = this.afs.firestore.collection("orgs").doc(this.orgInView).collection("events")
      eventsCollectionRef.doc(randomId).set({
        id: randomId,
        title: this.newEventTitle,
        start: this.newEventStart,
        end: this.newEventEnd,
        location: this.newEventLocation,
        description: this.newEventDescription,
        creator: this.auth.currentUser.email,
        rsvpedMembers: [],
      })
    }
    this.newEventTitle = "";
    this.newEventStart = "";
    this.newEventEnd = "";
    this.newEventLocation = "";
    this.newEventDescription = "";
  }

  async rsvpToEvent(event){
     // If the user has already RSVPed
    if(event.rsvpedMembers.indexOf(this.auth.currentUser.email) > -1){
      window.alert("You have already registered to this event");
    }
    else{
      if(window.confirm("Please confirm that you want to RSVP to this event")){
        event.rsvpedMembers.push(this.auth.currentUser.email);
        await this.afs.collection('orgs/'+this.orgInView + "/events").doc(event.id).update({
          rsvpedMembers: event.rsvpedMembers
        });
        await this.afs.collection('allUsers/'+ this.auth.currentUser.email + '/orgs/' + this.orgInView + '/rsvpEvents').doc(event.id).set({});
        window.alert("Your RSVP is received");
      }
    }
  }

  async cancelRsvpToEvent(event){
    // If the user has already RSVPed
   if(event.rsvpedMembers.indexOf(this.auth.currentUser.email) == -1){
     window.alert("You have not registered for this event yet");
   }
   else{
     if(window.confirm("Please confirm that you want to cancel RSVP to this event")){
        event.rsvpedMembers.splice(event.rsvpedMembers.indexOf(this.auth.currentUser.email),1);
        console.log("event.rsvpedMembers: ", event.rsvpedMembers)
        await this.afs.collection('orgs/'+this.orgInView + "/events").doc(event.id).update({
          rsvpedMembers: event.rsvpedMembers
        });
        await this.afs.collection('allUsers/'+ this.auth.currentUser.email + '/orgs/' + this.orgInView + '/rsvpEvents').doc(event.id).delete();
        console.log("Entering allUseres")
        window.alert("Your RSVP is canceled");
     }
   }
 }



  // deleteEvent(eventToDelete: CalendarEvent) {
  //   this.events = this.events.filter((event) => event !== eventToDelete);
  // }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
