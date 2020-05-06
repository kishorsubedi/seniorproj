import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-sign-up-box',
  templateUrl: './login-sign-up-box.component.html',
  styleUrls: ['./login-sign-up-box.component.css']
})
export class LoginSignUpBoxComponent implements OnInit {
  signingUpOrg:boolean = false; 
  profilePic:any;
  orgLogo:any;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  signInWithEmailPassword(email:string, password:string) {
    this.auth.signInWithEmailPassword(email, password);
  }

  signUpOrgButtonClicked(){
    this.signingUpOrg = true;
  }

  uploadProfilePic(event){
    this.profilePic = event.target.files[0];
  }

  uploadOrglogo(event){
    this.orgLogo = event.target.files[0];
  }

  signUpWithEmailPassword(email:string, password:string, signupOrgName:string, name:string) {
    if(!this.signingUpOrg){
      if(email == '' || password == '' || signupOrgName == '' || name == '' || !this.profilePic)
      {
        window.alert("All fields required");
        return;
      }
      this.auth.signUpWithEmailPassword(email, password, signupOrgName, name, [this.profilePic]);
    }
    else{
      console.log(this.orgLogo);
      if(email == '' || password == '' || signupOrgName == '' || name == '' || !this.profilePic || !this.orgLogo)
      {
        window.alert("All fields required");
        return;
      }
      this.auth.signUpWithEmailPassword(email, password, signupOrgName, name, [this.profilePic, this.orgLogo],signupOrgName);
    }

  }

  loginWithGoogle(){
    this.auth.loginWithGoogle();
  }

}
