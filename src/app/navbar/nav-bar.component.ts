import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { User } from '../models/user.model';
import { AuthenticationService } from '../services/authentication.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  providers: [ AuthenticationService ]
})

export class NavBarComponent implements OnInit {
  public userLoggedIn: boolean;
  public userString: string;
  public userJson: User;

  message: string;

  constructor (
    private authenticationService: AuthenticationService,
    private _flashMessagesService: FlashMessagesService,
    private _router: Router,
    private data: DataService
  ) {}

  logout() {
    this.authenticationService.logout();
    this.data.changeMessage("The user logged out.");
    this._router.navigate(['/home']);
  }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message);
  }


}
