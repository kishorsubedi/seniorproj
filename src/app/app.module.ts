import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';
import { LoginSignUpBoxComponent } from './login-sign-up-box/login-sign-up-box.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular material modules
import { MatSliderModule } from '@angular/material/slider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HomepageComponent } from './homepage/homepage.component';
import { HomepageTopbarComponent } from './homepage-topbar/homepage-topbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AboutUsBoxComponent } from './about-us-box/about-us-box.component';
import { CalendarComponent } from './calendar/calendar.component';
import { from } from 'rxjs';


const firebaseConfig = {
  apiKey: "AIzaSyDqRAoNqLcT8LXeEHvkDo_0UB45WoPNeOo",
  authDomain: "seniorproj-52255.firebaseapp.com",
  databaseURL: "https://seniorproj-52255.firebaseio.com",
  projectId: "seniorproj-52255",
  storageBucket: "seniorproj-52255.appspot.com",
  messagingSenderId: "388578599485",
  appId: "1:388578599485:web:21911499b2745a4f8f0054",
  measurementId: "G-2KWKLFVXY5"
};

@NgModule({
  declarations: [
    AppComponent,
    LoginSignUpBoxComponent,
    DashboardComponent,
    PageNotFoundComponent,
    HomepageComponent,
    HomepageTopbarComponent,
    AboutUsBoxComponent,
    CalendarComponent,
  ],
  imports: [
    FullCalendarModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features 
    AngularFirestoreModule.enablePersistence(), BrowserAnimationsModule,
    // Angular Material Modules
    MatSliderModule, 
    MatMenuModule, 
    MatIconModule, 
    MatCardModule, 
    MatDividerModule, 
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule
  ],
  providers: [AuthService, AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }