import {
  Component, OnInit, Input, Output, DoCheck
} from '@angular/core';
import { User } from '../models/user.model';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer } from '@angular/platform-browser';
import { FacebookService } from 'ngx-facebook/dist/esm/providers/facebook';
import { Globals } from '../globals';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  providers: [  ]
})

export class NavBarComponent implements OnInit, DoCheck {

  errorMessage: string;
  username = '';
  avatarimage = '';
  currentUser: User;
  admin;

  constructor (
    private _flashMessagesService: FlashMessagesService,
    private _router: Router,
    public userService: UserService,
    private sanitizer: DomSanitizer,
    private FB: FacebookService,
    private globals: Globals
  ) {
  }

  updateMyself() {
    this.admin = false;
    this.currentUser = this.userService.getCurrentUser();
    // console.log('In navbar: ' + JSON.stringify(this.currentUser));
    if (this.currentUser) {
      this.username = this.currentUser.username;
     // console.log('username: ' + this.username);
    }
    if (this.currentUser && this.currentUser.admin) {
      this.admin = true;
    } else {
      this.admin = false;
    }

  }

  logout() {
    this.username = null;
    this.avatarimage = '';
    this.userService.logout();
    localStorage.removeItem('username');
    this._router.navigate(['/welcome']);
    this.FB.logout();
  }


  ngOnInit() {
    this.updateMyself();
    this.username = localStorage.getItem('username');
    this.updateAvatar();

  }

  updateAvatar() {
    if (this.currentUser) {
      if (this.currentUser.facebookRegistration) {
       // console.log('This was a fb reg.');
        this.avatarimage = this.currentUser.avatar_URL;
       // console.log('The avatar url is: ' + this.avatarimage);

      } else {
       // console.log('This was not a fb reg.');
       if (this.currentUser.avatar_filename) {
        this.avatarimage = this.globals.avatars + '/' + this.currentUser.id + '/' + this.currentUser.avatar_filename; } else {
        this.avatarimage = this.globals.avatars + '/placeholder.png';
        }
      }
    }
  }

  gotoSettings() {
    const navigationString = '/usersettings/' + this.userService.currentUser.id + '/edit';
    this._router.navigate([navigationString]);
  }

 ngDoCheck() {
  this.username = localStorage.getItem('username');
  if (!this.username || this.username === '') {
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser) {
      this.username = this.currentUser.username;
    }
  }
  this.updateAvatar();
 }

}
