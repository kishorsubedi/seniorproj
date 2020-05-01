import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface AttendedEvents {
  date: string;
  title: string;
  org: string;
}

const EVENT_DATA: AttendedEvents[] = [
  {date:'04/03/2020', title: 'Bit Awards', org: 'ACM'},
  {date:'10/15/2020', title: 'Byte@Night', org: 'ACM'},
  {date:'08/27/2020', title: 'GBM', org: 'ACM'},
  {date:'09/03/2020', title: 'Git Work Shop', org: 'ACM'},
  {date:'04/25/2020', title: 'Meet&Greet', org: 'ACM'},
  {date:'05/18/2020', title: 'Networking Workshop', org: 'ACM'},
  {date:'07/25/2020', title: 'Eminado', org: 'ACM'},
  {date:'11/18/2020', title: 'Ma Lo', org: 'ACM'},
]

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  displayedColumns: string[] = ['date', 'title', 'org'];
  dataSource = EVENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
