import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { AttendedEvents } from '../profile/profile.component';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  // refs allUsers/mca@gmail.com doc
  userCollectionRef:AngularFirestoreDocument;

  // refs allUsers/mca@gmail.com/orgs/mca/rsvpedEvents/mrqZ14qW33zsKvtdxycU
  // need to figure out how to get the doc ID from rsvpedEvent col
  rsvpedEventsCollectRef: AngularFirestoreCollection;

  rsvpEventsDocument: AngularFirestoreDocument;

  constructor(private auth: AuthService, 
    private afs: AngularFirestore) {
      
      this.userCollectionRef = this.afs.doc("allUsers/"+ this.auth.afAuth.auth.currentUser.email);
      //this.rsvpedEventsCollectRef = 
          //this.afs.collection(`allUsers/${this.auth.afAuth.auth.currentUser.email}/orgs/testorg/rsvpEvents`);
        
  }

  async _getEvents(eventId: string, org: string){
    console.log("RIRI");
    //get user's events from database(use this.this.userCollectionRef.collection) here
    
    var eventInfo: AttendedEvents;
    "/orgs/abc/events/95b0102a-bdc6-02c7-34dd-26537d95583e"
    this.rsvpEventsDocument = 
          this.afs.collection(`orgs/${org}/events/`).doc(eventId);

    await this.rsvpEventsDocument.ref.get().then(doc => {
      if(doc.exists) { 
        eventInfo = {date: String(doc.get('start')),
                    title: String(doc.get('title')),
                    org: org};
      } else {
        console.log("Doc doesn't exist!");
        return;
      }
    })
    return eventInfo;
  }

  async getEvents(org: string){
    console.log("RIRI");
    //get user's events from database(use this.this.userCollectionRef.collection) here
    this.rsvpedEventsCollectRef = 
        this.afs.collection(`allUsers/${this.auth.afAuth.auth.currentUser.email}/orgs/${org}/rsvpEvents`);
    var rsvpedEvents = [];
    const snapshot = this.rsvpedEventsCollectRef;
    (await snapshot.ref.get()).forEach(doc => { 
      rsvpedEvents[doc.id] = doc.data();
    });
    return rsvpedEvents;
  }
  
  async getUserName(){
    //do this.userCollectionRef.get().then(snapshot => .....
    var userNameString: string;

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

