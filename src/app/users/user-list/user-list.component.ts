import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../user.service';

@Component({
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [UserService]
})

export class UserListComponent implements OnInit {

  users: User[];
  filteredUsers: User[];
  selectedUser: User;
  errorMessage: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService
     .getUsers().subscribe(
       users => { this.users = users;
        this.filteredUsers = this.users;
       },
       error => this.errorMessage = <any>error);


 }

  getUsers() {

  }


  private getIndexOfUser = (userId: String) => {
    return this.users.findIndex((user) => {
      return user._id === userId;
    });
  }

  selectUser(user: User) {
    this.selectedUser = user;
  }

  createNewUser() {
    var user: User = {
      username:'', email:'', firstname:'', password: '', lastname: '',
    };

    // By default, a newly-created course will have the selected state.
    this.selectUser(user);
  }

  deleteUser = (userId: String) => {
    var idx = this.getIndexOfUser(userId);
    if (idx !== -1) {
      this.users.splice(idx, 1);
      this.selectUser(null);
    }
    return this.users;
  }

  addUser = (user: User) => {
    this.users.push(user);
    this.selectUser(user);
    return this.users;
  }

  updateUser = (user: User) => {
    var idx = this.getIndexOfUser(user._id);
    if (idx !== -1) {
      this.users[idx] = user;
      this.selectUser(user);
    }
    return this.users;
  }
}



