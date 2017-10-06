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
    console.log(JSON.stringify(this.currentUser));
    if (this.currentUser.user_type === 'admin') {
      this.admin = true;
    }
  }

  logout() {
    this.username = null;
    this.avatarimage = '';
    this.authenticationService.logout();
    localStorage.removeItem('username');
    localStorage.removeItem('avatarimage');
    this._router.navigate(['/welcome']);
  }


  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.avatarimage = localStorage.getItem('avatarimage');
  }

 ngDoCheck() {
  this.username = localStorage.getItem('username');
  this.avatarimage = localStorage.getItem('avatarimage');
 }

}
