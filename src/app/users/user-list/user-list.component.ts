import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [UserService]
})

export class UserListComponent implements OnInit {

  userCount: number;
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
    this.userService
    .getUsers().subscribe(
      courses =>  {this.users = courses;
      this.userCount = this.users.length; },
      error => this.errorMessage = <any>error);

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
    const thisUser = new User( '', '', '', '', '', '', '', '', '', '', '0');

    // By default, a newly-created course will have the selected state.
    this.selectUser( thisUser );
  }

  // deleteUser(userId) {
  //   // console.log('In the Admin Component: Deleting course #' + courseId);

  //   this.userService.deleteUser(userId).subscribe(
  //     data => { // console.log('deleted course: ');
  //     this.getUsers(); },
  //     error => this.errorMessage = <any>error );
  // }


  addUser = (user: User) => {
    this.users.push(user);
    this.selectUser(user);
    return this.users;
  }

  updateUser = (user: User) => {
    const idx = this.getIndexOfUser(user._id);
    if (idx !== -1) {
      this.users[idx] = user;
      this.selectUser(user);
    }
    return this.users;
  }

}



