import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState: Observable<firebase.User>
  private currentUser: firebase.User = null;

  constructor(public afAuth: AngularFireAuth, public afs: AngularFirestore, private router: Router) {
    this.authState = this.afAuth.authState;

    this.authState.subscribe(user => {
      if (user) {
        console.log("user id = ", afAuth.auth.currentUser.uid);
        this.currentUser = user;
        this.router.navigateByUrl('/dashboard');
      } else {
        console.log("if not user");
        this.currentUser = null;
      }
    });

   }

   getAuthState() {
    return this.authState;
  }

  signInWithEmailPassword(email: string, password:string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then((user) => {    
      console.log("success logging in");
      this.router.navigateByUrl('/dashboard');
      console.log(this.afAuth.auth.currentUser.uid);
      return;
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      window.alert(errorMessage);
    });
    return;
  }

  signUpWithEmailPassword(email: string, password:string) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((user) => {
      
      console.log("success signing up");
      console.log(user.user.uid);
      var usersCollectionRef = this.afs.collection('users'); // a ref to the users collection
      usersCollectionRef.doc(this.afAuth.auth.currentUser.uid).set({ email: email });
  
      this.router.navigateByUrl('/dashboard');
      return;
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert(errorMessage);
      // ...
    });
  }

  signOut(){
    this.afAuth.auth.signOut();
    console.log("signOut successful");
    this.router.navigateByUrl('/');
    return;
  }
}
