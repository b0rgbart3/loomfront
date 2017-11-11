import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../models/user.model';
import { UserService } from '../users/user.service';


@Component({
    templateUrl: 'welcome.component.html',
    styleUrls: ['welcome.component.css']
})

export class WelcomeComponent implements OnInit {
    username;
    currentUser: User;

    constructor( private router: Router,
        private _flashMessagesService: FlashMessagesService, private zone: NgZone,
    private userService: UserService ) {

        }

        login() {
           this.router.navigate(['/login']);
        }

        ngOnInit() {
            // this.username = localStorage.getItem('username');
            this.currentUser = this.userService.getCurrentUser();

            if (this.currentUser) {
            this.username = this.currentUser.username; } else {
                this.username = '';
            }
            console.log('end of welcome init.');
        }


}
