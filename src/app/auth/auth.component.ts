import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor() { }
  login(email, password){
    console.log(email.value);
  }
  signup(email, password){
    console.log(email.value);
  }
  ngOnInit(): void {
  }

}
