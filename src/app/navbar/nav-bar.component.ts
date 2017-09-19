import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { User } from '../models/user.model';
import { AuthenticationService } from '../services/authentication.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';


@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  providers: [ AuthenticationService ]
})

export class NavBarComponent implements OnInit {
  public currentUser: User;
  public admin: boolean;

  constructor (
    private authenticationService: AuthenticationService,
    private _flashMessagesService: FlashMessagesService,
    private _router: Router,

  ) {}

  loggedinusername() {
    this.admin = false;
    this.currentUser = <User> JSON.parse(localStorage.getItem('currentUser') );

    if (this.currentUser) {
      // console.log('CurrentUser name: ' + this.currentUser.username);

      if (this.currentUser.user_type === 'admin') { this.admin = true; }
      return this.currentUser.username;
    } else {
      return null;
    }
  }


  logout() {
    this.authenticationService.logout();
    this._router.navigate(['/welcome']);
  }

  ngOnInit() {
     this.loggedinusername();
  }


}
