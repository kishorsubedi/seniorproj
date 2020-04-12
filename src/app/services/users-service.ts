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
  //Returns all admins in an array
   getAdmins(){
    this.afs.collection('admins').valueChanges().subscribe(admins=>{
      this.admins = admins;
    })
    console.log(this.admins);
    return this.admins;
   }
   //Returns all members in an array
   getMembers(){
    this.afs.collection('users').valueChanges().subscribe(members=>{
      this.members = members;
    })
    console.log(this.members);
    return this.members;

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

