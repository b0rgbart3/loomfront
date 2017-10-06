import { Component, OnInit, NgZone } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../models/user.model';


@Component({
    templateUrl: 'welcome.component.html',
    styleUrls: ['welcome.component.css']
})

export class WelcomeComponent implements OnInit {
    username;
    currentUser: User;

    constructor(    public authenticationService: AuthenticationService, private router: Router,
        private _flashMessagesService: FlashMessagesService, private zone: NgZone ) {

        }

        login() {
           this.router.navigate(['/login']);
        }

        ngOnInit() {
            // this.username = localStorage.getItem('username');
            this.currentUser = this.authenticationService.getCurrentUser();

            if (this.currentUser) {
            this.username = this.currentUser.username; } else {
                this.username = '';
            }
        }


}
