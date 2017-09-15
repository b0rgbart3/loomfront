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

  constructor (
    private authenticationService: AuthenticationService,
    private _flashMessagesService: FlashMessagesService,
    private _router: Router,

  ) {}

  loggedinusername() {
    let storedUserString = localStorage.getItem('currentUser');

    if (storedUserString)
    { 
      this.currentUser = <User> JSON.parse(storedUserString);
      return this.currentUser.username;
    }
   else
    {
      this.currentUser = null;
      return null;
    }
  }


  logout() {
    this.authenticationService.logout();
    this._router.navigate(['/welcome']);
  }

  ngOnInit() {

  }


}
