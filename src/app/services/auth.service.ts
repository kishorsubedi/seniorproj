import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState: Observable<firebase.User>
  private currentUser: firebase.User = null;

  constructor(public afAuth: AngularFireAuth, public afs: AngularFirestore) {
    this.authState = this.afAuth.authState;
    this.authState.subscribe(user => {
      if (user) {
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });
   }

   getAuthState() {
    return this.authState;
  }

  signInWithEmailPassword(email: string, password:string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      window.alert(errorMessage);
    });
    return;
  }

  signUpWithEmailPassword(email: string, password:string) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert(errorMessage);
      // ...
    });
    console.log("success signing up");
    var usersCollectionRef = this.afs.collection('users'); // a ref to the users collection
    usersCollectionRef.doc(this.currentUser.uid).set({ email: email });
    return;
  }
}
