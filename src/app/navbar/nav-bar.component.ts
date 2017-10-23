import {
  Component, OnInit, Input, Output, DoCheck
} from '@angular/core';
import { User } from '../models/user.model';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { UserService } from '../users/user.service';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer } from '@angular/platform-browser';

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
    private sanitizer: DomSanitizer
  ) {
  }

  updateMyself() {
    this.currentUser = this.userService.getCurrentUser();
    // console.log(JSON.stringify(this.currentUser));
    if (this.currentUser && this.currentUser.admin) {
      this.admin = true;
    }

  }

  logout() {
    this.username = null;
    this.avatarimage = '';
    this.userService.logout();
    localStorage.removeItem('username');
    this._router.navigate(['/welcome']);
  }


  ngOnInit() {
    this.updateMyself();
    this.username = localStorage.getItem('username');
  }

 ngDoCheck() {
  this.username = localStorage.getItem('username');
  if (!this.username || this.username === '') {
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser) {
      this.username = this.currentUser.username;
    }
  }

 }

}
