import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor() { }
  login(){
    console.log("logging in");
  }
  signup(){
    console.log("signing up");
  }
  ngOnInit(): void {
  }

}
