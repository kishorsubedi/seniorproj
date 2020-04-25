import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // dateclick
import googleCalendarPlugin from '@fullcalendar/google-calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin, googleCalendarPlugin];
  calendarWeekends = true;
  calendarEvents= 'scs.howard.edu_7j0h13om9mtlmdmvdg8t4tjlnc@group.calendar.google.com';
  goCalendarApiKey= 'AIzaSyCxdkhGz3AMZZ8mMV35AHouTPF0g2hEol8';


  toggleVisible() {
    this.calendarVisible = !this.calendarVisible;
  }
  
  toggleWeekends() {
    this.calendarWeekends = !this.calendarWeekends;
  }

  gotoPast () {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate('2000-01-01'); // method to go to past date
  }

  googleEventClick (arg) {
    window.open(arg.event.url, '_blank', 'width=700,height=600');
    arg.jsEvent.preventDefault();
  }

  constructor() { }

  ngOnInit(): void {
  }

}
