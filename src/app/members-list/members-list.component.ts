import { Component, OnInit } from '@angular/core';

export interface Member {
 email: string;
}

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

export class AppComponent {

 }
