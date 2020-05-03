import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';
import { LoginSignUpBoxComponent } from './login-sign-up-box/login-sign-up-box.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { UsersService } from './services/users-service';

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
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';

//CalendarModules
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { AboutUsBoxComponent } from './about-us-box/about-us-box.component';
import { orgdashboardComponent } from './orgdashboard/orgdashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { from } from 'rxjs';
import { ViewMembersBox } from './view-members-box/view-members-box';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { OrgProDashboardComponent } from './org-pro-dashboard/org-pro-dashboard.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


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
    orgdashboardComponent,
    CalendarComponent,
    ViewMembersBox,
    ProfileComponent,
    LoginComponent,
    OrgProDashboardComponent,
    CalendarViewComponent,
  ],
  imports: [
    
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features 
    AngularFirestoreModule.enablePersistence(), BrowserAnimationsModule,
    AngularFireStorageModule,
    FormsModule,
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
    MatToolbarModule, 
    MatGridListModule,
    MatListModule,
    MatTableModule,
    MatDialogModule,
    MatSortModule,

    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    CommonModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    FontAwesomeModule,
  ],
  providers: [AuthService, AngularFirestore, UsersService],
  bootstrap: [AppComponent]
})

export class AppModule { }