import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';
import { LoginSignUpBoxComponent } from './login-sign-up-box/login-sign-up-box.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features 
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
