import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { CalendarViewComponent } from "../calendar-view/calendar-view.component"

@Component({
  selector: 'app-orgdashboard',
  templateUrl: './orgdashboard.component.html',
  styleUrls: ['./orgdashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class orgdashboardComponent implements OnInit {
  @Input() orgInView: string;

  constructor() {
   }

  ngOnInit(): void {
  }
  
  ngAfterInit(): void{
    
  }
}
