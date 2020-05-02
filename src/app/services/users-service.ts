import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  userCollectionRef:AngularFirestoreDocument;

  constructor(private auth: AuthService, 
    private afs: AngularFirestore) {
      
    this.userCollectionRef = this.afs.doc("allUsers/"+ this.auth.afAuth.auth.currentUser.email);
    
    
  }

  getEvents(){
    console.log("RIRI");
    //get user's events from database(use this.this.userCollectionRef.collection) here
  }

  getOrgs(){
    //get user's orgs from database here
  }

  async getUserName(){
    //do this.userCollectionRef.get().then(snapshot => .....
    var userNameString: string;
    /*
    var doc = await this.userCollectionRef.ref.get();
    userNameString = doc.get('name');
    console.log("WTF Type: ", typeof userNameString);
    */

   await this.userCollectionRef.ref.get().then(doc => {
      if (doc.exists) {
        console.log("Name please: ", typeof doc.get('name'))
      userNameString = String(doc.get('name'));
      } else {
        console.log("Either no name or error!");
        return;
      }

    }).catch(err => {
      console.log("Error getting doc: ", err)
    });
    
    return userNameString;
  }
  
}

