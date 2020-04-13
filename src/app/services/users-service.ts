import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  admins: User[];
  members: User[];
  invitedMembers: User[];
  constructor(private afs: AngularFirestore) { }
  //Returns all admins as observables
   getAdmins(){
    return this.afs.collection('admins').valueChanges();
   }
   //Returns all members in an array
   getMembers(){
    return this.afs.collection('users').valueChanges();
    // this.afs.collection('users').valueChanges().subscribe(members=>{
    //   this.members = members;
    // })
    // console.log(this.members);
    // return this.members;

   }

   //Returns all invited users in an array
   getInvitedUsers(){
    this.afs.collection('invitedMembers').valueChanges().subscribe(invited=>{
      this.invitedMembers = invited;
    })
    console.log(this.invitedMembers);
    return this.invitedMembers;
   }
}

