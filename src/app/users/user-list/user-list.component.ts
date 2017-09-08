import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [UserService]
})

export class UserListComponent implements OnInit {

  users: User[]
  selectedUser: User

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService
     .getUsers()
     .then((users: User[]) => {
       this.users = users.map((user) => {
        //  if (!contact.phone) {
        //    contact.phone = {
        //      mobile: '',
        //      work: ''
        //    }
        //  }
         return user;
       });
     });
 }

  getUsers() {

this.userService
      .getUsers()
      .then((users: User[]) => {
        this.users = users.map((user) => {
          return user;
        });
      });

    // this.courseService.getCourses().subscribe(
    //   courses => this.courses = courses);
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



