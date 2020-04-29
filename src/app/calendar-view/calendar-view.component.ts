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
//import { Bootstrap } from 'bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import {  OnInit, Input } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

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

  actions: CalendarEventAction[] = [
    {
      label: 'Edit ',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEdit(event);
      },
    },
    {
      label: 'Delete',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        //this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleDelete(event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events;

  activeDayIsOpen: boolean = true;

  // For adding events
  newEventTitle: string = "";
  newEventStart: string = "";
  newEventEnd: string = "";
  newEventLocation: string = "";
  newEventDescription: string= "";

  // For Editing events
  oldEventTitle: string = "";
  editEventTitle: string = "";
  editEventStart: string = "";
  editEventEnd: string = "";
  editEventLocation: string = "";
  editEventDescription: string= "";

  constructor(private modal: NgbModal, private afs:AngularFirestore) {}

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
          event.actions = this.actions;
          event.start = new Date(event.start);
          if(event.end){
            event.end = new Date(event.end);
          }
          console.log(event);
        }

        this.events =duplicateEvents;
        console.log(this.events);
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
      console.log("action is delete");
      if (window.confirm("Confirm that you want to delete this event")){
        await this.afs.collection("orgs/"+ this.orgInView + "/events").doc(event.title).delete();
        window.alert("This event is deleted")
      }
    }
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });


  handleEdit(event){
    console.log("Edited")
    this.editEventTitle  = event.title;
    this.oldEventTitle = event.title;
    this.editEventStart = event.start;
    this.editEventEnd = event.end;
    this.editEventLocation = event.location;
    this.editEventDescription = event.description;

    this.modal.open(this.modalEdit, { size: 'lg' });
  }

  async confirmEdit(){
    if(window.confirm("Please confirm that you want to make these changes")){
      await this.afs.collection('orgs/'+this.orgInView + "/events").doc(this.oldEventTitle).update({
        title: this.editEventTitle,
        start: this.editEventStart,
        end: this.editEventEnd,
        location: this.editEventLocation,
        description: this.editEventDescription
      });
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }


  // This part is for adding events


  addEvent(): void {
    if(this.orgInView){
      var eventsCollectionRef = this.afs.firestore.collection("orgs").doc(this.orgInView).collection("events")
      eventsCollectionRef.doc(this.newEventTitle).set({
        title: this.newEventTitle,
        start: this.newEventStart,
        end: this.newEventEnd,
        location: this.newEventLocation,
        description: this.newEventDescription,
      })
    }
      
    // this.events = [
    //   ...this.events,
    //   {
    //     title: 'New event',
    //     start: startOfDay(new Date()),
    //     end: endOfDay(new Date()),
    //     color: colors.red,
    //     draggable: true,
    //     resizable: {
    //       beforeStart: true,
    //       afterEnd: true,
    //     },
    //   },
    //];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
