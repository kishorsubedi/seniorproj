import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { AttendedEvents } from '../profile/profile.component';

@Injectable({
  providedIn: 'root'
})
export class UsersService { 
  
  userCollectionRef:AngularFirestoreDocument;
  rsvpedEventsCollectRef: AngularFirestoreCollection;
  rsvpEventsDocument: AngularFirestoreDocument;

  constructor(private auth: AuthService, 
    private afs: AngularFirestore) { 

    this.userCollectionRef = this.afs.doc("allUsers/"+ this.auth.afAuth.auth.currentUser.email);
        
  }

  // helper function that makes FB call to get the info about each event
  async _getEvents(eventId: string, org: string){
    
    var eventInfo: AttendedEvents;
    this.rsvpEventsDocument = this.afs.collection(`orgs/${org}/events/`).doc(eventId);
    await this.rsvpEventsDocument.ref.get().then(doc => {
      if(doc.exists) { 
        eventInfo = {date: String(doc.get('start')),
                    title: String(doc.get('title')),
                    location: String(doc.get('location'))};
      } else {
        console.log("Doc doesn't exist!");
        return;
      }
    })
    return eventInfo;
  }

  // gets every event from the users/org/rsvpEvents collection on firebase
  async getEvents(org: string, userEmail?: string){
    if(!userEmail){
      userEmail = this.auth.afAuth.auth.currentUser.email;
    }
    this.rsvpedEventsCollectRef = 
        this.afs.collection(`allUsers/${userEmail}/orgs/${org}/rsvpEvents`);
    var rsvpedEvents = [];
    const snapshot = this.rsvpedEventsCollectRef;
    (await snapshot.ref.get()).forEach(doc => { 
      rsvpedEvents[doc.id] = doc.data();
    });
    return rsvpedEvents;
  }

  // returns the username String from the database
  async getUserName(){
    
    var userNameString: string;
    await this.userCollectionRef.ref.get().then(doc => {
      if (doc.exists) {
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

