import { Component, OnInit, Input } from '@angular/core';
import { User } from '../models/user.model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  providers: [ AuthenticationService ]
})

export class NavBarComponent {
  public userLoggedIn: boolean;

  public userString = localStorage.getItem('currentUser');

  constructor (

  ) {}







}
