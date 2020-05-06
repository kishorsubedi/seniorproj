import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UsersService } from '../services/users-service';

@Component({
  selector: 'app-homepage-topbar',
  templateUrl: './homepage-topbar.component.html',
  styleUrls: ['./homepage-topbar.component.css']
})
export class HomepageTopbarComponent implements OnInit {
  userLoggedIn: boolean = false
  userName: string;

  constructor(private usersService: UsersService,private auth: AuthService, private router: Router) {
    if (this.auth.afAuth.auth.currentUser != null)
      this.userLoggedIn = true
      this.getUserName();
      console.log("Name is: ", this.userName);
   }

  ngOnInit(): void {
  }

  signOut(){
    this.auth.signOut();
  }

 async getUserName(){
    await this.usersService.getUserName().then(res => {
      this.userName = res;
    });
  }

}
