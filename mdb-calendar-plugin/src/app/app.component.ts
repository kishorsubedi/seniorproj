import {Component, OnInit} from '@angular/core';
import {CalendarEvent} from 'mdb-calendar/lib/interfaces/calendar-event.interface';
import { startOfDay, endOfDay } from 'date-fns';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  events: CalendarEvent[] = [
    {
      id: '1',
      startDate: new Date(startOfDay(new Date(2019, 1, 20))),
      endDate: new Date(endOfDay(new Date(2019, 1, 28))),
      name: 'Test event',
      color: 'info',
    },
    {
      id: '2',
      startDate: new Date(startOfDay(new Date(2019, 1, 26))),
      endDate: new Date(endOfDay(new Date(2019, 1, 26))),
      name: 'Test event',
      color: 'success'
    },
    {
      id: '3',
      startDate: new Date(startOfDay(new Date())),
      endDate: new Date(endOfDay(new Date())),
      name: 'Test event',
      color: 'secondary'
    },
    {
      id: '4',
      startDate: new Date(new Date(2019, 1, 27).setHours(0, 0, 0, 0)),
      endDate: new Date(new Date(2019, 1, 28).setHours(23, 59, 59, 999)),
      name: 'Test event 5',
      color: 'danger'
    },
    {
      id: '5',
      startDate: new Date(startOfDay(new Date(2019, 1, 5))),
      endDate: new Date(endOfDay(new Date(2019, 1, 5))),
      name: 'Test event',
      color: 'warning'
    },
  ];

  generateUid() {
    const uid = Math.random().toString(36).substr(2, 9);
    return `mdb-calendar-event-${uid}`;
  }

  ngOnInit() {
    this.generateUid();
  }

  onEventEdit(event: CalendarEvent) {
    const oldEvent = this.events.findIndex(test => test.id === event.id);
    this.events[oldEvent] = event;
    this.events = [...this.events];
  }

  onEventAdd(event: CalendarEvent) {
    event.id = this.generateUid();
    this.events = [...this.events, event];
  }

  onEventDelete(deletedEvent: CalendarEvent) {
    const eventIndex = this.events.findIndex(event => event.id === deletedEvent.id);
    this.events.splice(eventIndex, 1);
    this.events = [...this.events];
  }
}
