import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { Observable, timer } from 'rxjs';
import { stringify } from 'querystring';
import { EmailValidator } from '@angular/forms';

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
        //this.router.navigateByUrl('/dashboard');
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
    this.afs.firestore.doc('/allUsers/'+ credential.user.email).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          // do something
          this.router.navigateByUrl('/dashboard');
        }
        else{
          window.alert("No Google account found associated with us");
        }
      });
  }

  createUser(uid:string, email:string, org:string){
    var usersCollectionRef = this.afs.collection('orgs/'+org+'/users/'); // a ref to the users collection
    usersCollectionRef.doc(email).set({ email: email });

    var usersOrgCollectionRef = this.afs.collection('allUsers/'+email+'/orgs/'); // a ref to the users collection
    usersOrgCollectionRef.doc(org).update({ role: 'member' });
  }

  signUpWithEmailPassword(email: string, password:string, signupOrgName:string) {
    //shouldn't be in allUsers. 
    // if in admin already, first time creator. org -> creator, allUsers.orgs -> org
    // else, if in invitedMembers, org -> creator, allUsers.orgs -> org
    //else no invittation
    this.afs.firestore.doc('/allUsers/'+ email).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          window.alert(" Already an OrgPro member! Please login. ");
          return;
        }
        else{

          this.afs.firestore.doc('/orgs/'+ signupOrgName).get()
          .then(docSnapshot => {
            if (docSnapshot.exists) {
              // do something
              var role = "member";
              if (docSnapshot.data().activated == false){
                if (docSnapshot.data().creator != email){
                  window.alert("You aren't designated to activate this org!");
                  return;
                }
                else{
                  role = "admin";
                }
              }
              //either admin activating the org, or member trying to join the activated org     
              
              this.afs.firestore.collection("orgs/"+signupOrgName+"/invitedMembers").doc(email).get().then(docSnapshot => {
                if(role == "member" && !docSnapshot.exists){
                  window.alert("No invitation to join this org yet!");
                  return;
                }
                else{
                    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(async (user) => {
                    
                    const snapshot = await this.afs.firestore.collection("allUsers").doc(email).set({email: email});
                    var allUsersRef = this.afs.firestore.collection("allUsers").doc(email);
                    const snapshot2 = await allUsersRef.collection("orgs").doc(signupOrgName).set({role: role, id: signupOrgName});

                    const snapshot3 = await this.afs.doc("allUsers/"+email+"/orgs/"+signupOrgName).get().subscribe(function (querySnapshot) {
                      console.log(querySnapshot.data()); 
                    });
                    
                    if(role == "admin"){
                      await this.afs.collection('orgs/').doc(signupOrgName).update({activated: true}); // a ref to the users collection
                      var orgAdminsCollectionRef = this.afs.collection('orgs/'+signupOrgName+ "/admins"); // a ref to the users collection
                      await orgAdminsCollectionRef.doc(email).set({ email: email });
                    }
                    else{
                      var orgAdminsCollectionRef = this.afs.collection('orgs/'+signupOrgName+ "/users"); // a ref to the users collection
                      await orgAdminsCollectionRef.doc(email).set({ email: email });
                      await this.afs.collection("orgs/"+ signupOrgName + "/invitedMembers").doc(email).delete();                     
                    }
                  
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
              })
              

            }
            else{
              window.alert("We are in test mode! Only selected orgs can signup for now");
            }

          });

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
