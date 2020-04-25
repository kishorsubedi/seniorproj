import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error("Method not implemented.");
  }
  user = null;
  constructor(
    private auth: AuthService) { }

  ngOnInit() {
    this.auth.getAuthState().subscribe(
      (user) => this.user = user);
  }

  signInWithEmailPassword(email:string, password:string) {
    this.auth.signInWithEmailPassword(email, password);
  }
}