import { Component, OnInit, Input, OnChanges, DoCheck } from '@angular/core';
import { User } from '../models/user.model';
import { AuthenticationService } from '../services/authentication.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { UserService } from '../users/user.service';
import { Avatar } from '../models/avatar.model';


@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  providers: [ AuthenticationService ]
})

export class NavBarComponent implements OnInit {
  public currentUser: User;
  public admin: boolean;
  currentUserId: string;
  currentAvatar: Avatar;
  errorMessage: string;
  currentAvatarFile: string;

  constructor (
    private authenticationService: AuthenticationService,
    private _flashMessagesService: FlashMessagesService,
    private _router: Router,
    public userService: UserService

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

  getCurrentAvatar () {
    console.log('In navBar, requesting avatar: ' + this.currentUserId);
    this.authenticationService.getAvatar(this.currentUserId).subscribe(
        avatar => {
          console.log('Returned from async get subscription: ' + JSON.stringify(avatar) );
            this.currentAvatar = avatar[0];
            this.currentAvatarFile = 'http://localhost:3100/avatars/' + this.currentUserId + '/' + this.currentAvatar.filename;
            return this.currentAvatarFile;
     },
        error => this.errorMessage = <any>error);
        return null;
}

  logout() {
    this.authenticationService.logout();
    this._router.navigate(['/welcome']);
  }

  ngOnInit() {
    this.loggedinusername();
    this.currentUserId = this.authenticationService.getUserId();
    this.currentAvatar = null;
    this.currentAvatarFile = null;
    this.getCurrentAvatar();

    // Doesn't do any good to assign these here -- we just have to wait for the subscription to come back with real data

     // this.currentAvatar =  this.authenticationService.currentAvatar();
     // this.authenticationService.getCurrentAvatar();
    // this.currentAvatar = this.authenticationService.currentAvatar();
    // this.currentAvatarFile = this.authenticationService.currentAvatarFile();
    //  console.log("NavBar current Avatar File: " + this.currentAvatarFile);
    //  console.log("NavBar current Avatar: " + JSON.stringify(this.currentAvatar ) );
    //  console.log("NavBar currentUserId: " + this.currentUserId);
  }


}
