import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { Userthumbnail } from '../../../models/userthumbnail.model';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [UserService]
})

export class UserListComponent implements OnInit {


  thumbnails: Userthumbnail[];
  @Input() users: User[];

  constructor(private userService: UserService) { }

  ngOnInit() {

    // Generate an array of user thumbnail objects that correspond to our user array
    this.thumbnails = this.users.map( user =>
      this.createThumbnail( user) );

 }

 createThumbnail(user) {
  const thumbnailObj = { user: user, user_id: user.id, online: false,
      size: 50,  showUsername: false, showInfo: false, textColor: '#ffffff', hot: false, shape: 'circle' };
  return thumbnailObj;
}


  // getUsers() {
  //   this.userService
  //   .getUsers().subscribe(
  //     courses =>  {this.users = courses;
  //     this.userCount = this.users.length; },
  //     error => this.errorMessage = <any>error);

  // }


  // private getIndexOfUser = (userId: String) => {
  //   return this.users.findIndex((user) => {
  //     return user._id === userId;
  //   });
  // }

  // selectUser(user: User) {
  //   this.selectedUser = user;
  // }

  // createNewUser() {
  //   const thisUser = <User>{};
  //   // By default, a newly-created course will have the selected state.
  //   this.selectUser( thisUser );
  // }

  // deleteUser(userId) {
  //   // console.log('In the Admin Component: Deleting course #' + courseId);

  //   this.userService.deleteUser(userId).subscribe(
  //     data => { // console.log('deleted course: ');
  //     this.getUsers(); },
  //     error => this.errorMessage = <any>error );
  // }


  // addUser = (user: User) => {
  //   this.users.push(user);
  //   this.selectUser(user);
  //   return this.users;
  // }

  // updateUser = (user: User) => {
  //   const idx = this.getIndexOfUser(user._id);
  //   if (idx !== -1) {
  //     this.users[idx] = user;
  //     this.selectUser(user);
  //   }
  //   return this.users;
  // }

}



