import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  orgAdminsCollectionRef = this.afs.collection('orgs/acm/admins');
  constructor(private afs: AngularFirestore) { }
  //Returns all admins as observables
   getAdmins(){
    return this.orgAdminsCollectionRef.valueChanges();
    //return this.afs.collection('admins').valueChanges();
   }
   //Returns all members in an array
   getMembers(){
    return this.afs.collection('users').valueChanges();
   }

   //Returns all invited users in an array
   getInvitedUsers(){
    return this.afs.collection('invitedMembers').valueChanges();
   }
}

