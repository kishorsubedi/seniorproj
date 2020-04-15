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

  async loginWithGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    // if first time, add user to users table, else do nothing
    this.afs.firestore.doc('/users/'+ credential.user.email).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          // do something
          console.log("this user already exists in users table");
        }
        else{
          this.afs.firestore.doc('/admins/'+ credential.user.email).get()
              .then(docSnapshot => {
            if (docSnapshot.exists) {
              // do something
              console.log("this user already exists in admins table");
            }
            else{
              this.createUser(credential.user.uid, credential.user.email)
            }
          });
        }
        this.router.navigateByUrl('/dashboard');
      });
  }

  createUser(uid:string, email:string){
    var usersCollectionRef = this.afs.collection('users'); // a ref to the users collection
    usersCollectionRef.doc(email).set({ email: email });
  }

  signUpWithEmailPassword(email: string, password:string) {
    this.afs.firestore.doc('/invitedMembers/'+ email).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {

          this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((user) => {
            //remove from invitedMembers 
            this.afs.firestore.doc(`invitedMembers/${email}`).delete();
            
            this.createUser(user.user.uid, email);
            console.log("success signing up");
            console.log(user.user.uid);
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
        else{
          window.alert(" NO invitation yet! ");
          return;
        }
      });
  }

  signOut(){
    this.afAuth.auth.signOut();
    console.log("signOut successful");
    this.router.navigateByUrl('/');
    return;
  }
}
