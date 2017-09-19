import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
    templateUrl: 'welcome.component.html',
    styleUrls: ['welcome.component.css']
})

export class WelcomeComponent {


    constructor(    private authenticationService: AuthenticationService, private router: Router,
        private _flashMessagesService: FlashMessagesService,
  ) { }

        login() {
           this.router.navigate(['/login']);
        }

}