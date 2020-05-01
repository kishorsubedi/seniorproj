import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  dataSource;

  myDataArray = [
    "succeed","print", "discover",
    "bust","mundane","plod","decision",
    "knotty","bustling","bag","undesirable",
    "worship","lumber","damage"
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
