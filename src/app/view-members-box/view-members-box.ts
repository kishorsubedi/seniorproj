import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users-service';
import { User } from '../models/user';

@Component({
  selector: 'app-view-members-box',
  templateUrl: './view-members-box.html',
  styleUrls: ['./view-members-box.css']
})
export class ViewMembersBox implements OnInit {
  members: User[];
  admins: User[];
  invited: User[];
  userInView: User;
  membersInDisplay: User[];
  adminsInDisplay: User[];
  searchText: string;


  constructor(private usersService: UsersService) {  }
 
  ngOnInit(){
    this.members = this.usersService.getMembers();
    this.admins = this.usersService.getAdmins();
    this.invited = this.usersService.getInvitedUsers();
    this.userInView = this.members[0];
    this.membersInDisplay = this.usersService.getMembers();
    this.adminsInDisplay = this.usersService.getAdmins();

  }

  handleClick(user: User){
    console.log('Click!', user.email);
    this.userInView = user;
  }

  searchInArray(users: User[]){
    let result: User[];
    result = [];
    for(var user of users){
      if(user.email != null){
        if(user.email.search(this.searchText) != -1){
          result.push(user)
        }
      }
    }
    console.log(result);
    return result;
    }
  
  updateDisplay(){
    this.membersInDisplay = this.searchInArray(this.members);
    this.adminsInDisplay = this.searchInArray(this.admins);
  }
}

export class AppComponent {

 }
