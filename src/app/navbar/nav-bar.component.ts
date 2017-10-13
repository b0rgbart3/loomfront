import {
  Component, OnInit, Input, Output, DoCheck
} from '@angular/core';
import { User } from '../models/user.model';
import { AuthenticationService } from '../services/authentication.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { UserService } from '../users/user.service';
import { Avatar } from '../models/avatar.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  providers: [ AuthenticationService ]
})

export class NavBarComponent implements OnInit, DoCheck {

  errorMessage: string;
  username = '';
  avatar: Avatar;
  avatarimage = '';
  currentUser: User;
  admin;

  constructor (
    private authenticationService: AuthenticationService,
    private _flashMessagesService: FlashMessagesService,
    private _router: Router,
    public userService: UserService,

  ) {
  }

  updateMyself() {
    this.currentUser = this.authenticationService.getCurrentUser();
    // console.log(JSON.stringify(this.currentUser));
    if (this.currentUser && this.currentUser.user_type.includes('admin')) {
      this.admin = true;
    }
    if (this.currentUser) {
    this.userService.getAvatar(this.currentUser.id).subscribe(
      avatar =>  {this.avatar = avatar[0];
        console.log('In navbar updateMyself(), got new avatar: currentUser.id == ' + JSON.stringify( this.avatar) );
        this.avatarimage = this.userService.getAvatarImage(this.currentUser.id, this.avatar);
        console.log('Current Avatar Image: ' + this.avatarimage );
      },
      error => this.errorMessage = <any>error);

  }}

  logout() {
    this.username = null;
    this.avatarimage = '';
    this.authenticationService.logout();
    localStorage.removeItem('username');
    localStorage.removeItem('avatarimage');
    this._router.navigate(['/welcome']);
  }


  ngOnInit() {
    this.updateMyself();
    this.username = localStorage.getItem('username');
    this.avatarimage = localStorage.getItem('avatarimage');
  }

 ngDoCheck() {
  this.username = localStorage.getItem('username');
  if (!this.username || this.username === '') {
    this.currentUser = this.authenticationService.getCurrentUser();
    if (this.currentUser) {
      this.username = this.currentUser.username;
    }
  }
  if (this.currentUser && this.avatar) {
  this.avatarimage = this.userService.getAvatarImage(this.currentUser.id, this.avatar);
  }
 }

}
