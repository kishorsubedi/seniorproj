import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-sign-up-box',
  templateUrl: './login-sign-up-box.component.html',
  styleUrls: ['./login-sign-up-box.component.css']
})
export class LoginSignUpBoxComponent implements OnInit {
  file:any;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  signInWithEmailPassword(email:string, password:string) {
    this.auth.signInWithEmailPassword(email, password);
  }

  uploadFile(event){
    this.file = event.target.files[0];
  }

  signUpWithEmailPassword(email:string, password:string, signupOrgName:string, name:string) {
    if(email == '' || password == '' || signupOrgName == '' || name == '' || !this.file)
    {
      window.alert("All fields required");
      return;
    }
    this.auth.signUpWithEmailPassword(email, password, signupOrgName, name, this.file);
  }

  loginWithGoogle(){
    this.auth.loginWithGoogle();
  }

}
