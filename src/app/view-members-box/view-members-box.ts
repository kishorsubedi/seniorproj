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
  searchText: string;

  constructor(private usersService: UsersService) {  }
 
  ngOnInit(){
    this.members = this.usersService.getMembers();
    //console.log(this.members);
    this.admins = this.usersService.getAdmins();
    //console.log(this.admins);
    this.invited = this.usersService.getInvitedUsers();
    //console.log(this.invited);
    this.userInView = this.members[0];
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
}

export class AppComponent {

 }
