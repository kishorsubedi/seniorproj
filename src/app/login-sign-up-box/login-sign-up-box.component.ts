import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-sign-up-box',
  templateUrl: './login-sign-up-box.component.html',
  styleUrls: ['./login-sign-up-box.component.css']
})
export class LoginSignUpBoxComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  signInWithEmailPassword(email:string, password:string) {
    this.auth.signInWithEmailPassword(email, password);
  }

  signUpWithEmailPassword(email:string, password:string) {
    this.auth.signUpWithEmailPassword(email, password);
  }
  
}
