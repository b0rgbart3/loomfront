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
currentUser: User;
myData: string;


  constructor (
    private authenticationService: AuthenticationService,
    private _flashMessagesService: FlashMessagesService,
    private _router: Router,
    public userService: UserService,

  ) {
  }


  logout() {
    this.username = null;
    this.authenticationService.logout();
    localStorage.removeItem('username');
    this._router.navigate(['/welcome']);
  }


  ngOnInit() {
    this.username = localStorage.getItem('username');
    setInterval(function(){ this.username = localStorage.getItem('username'); console.log('updating to: ' + this.username); }, 5000);
  }

 ngDoCheck() {
  this.username = localStorage.getItem('username');
 }

}
