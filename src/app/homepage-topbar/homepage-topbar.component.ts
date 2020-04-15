import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage-topbar',
  templateUrl: './homepage-topbar.component.html',
  styleUrls: ['./homepage-topbar.component.css']
})
export class HomepageTopbarComponent implements OnInit {
  userLoggedIn: boolean = false

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.afAuth.auth.currentUser != null)
      this.userLoggedIn = true
   }

  ngOnInit(): void {
  }

  signOut(){
    this.auth.signOut();
  }

}
