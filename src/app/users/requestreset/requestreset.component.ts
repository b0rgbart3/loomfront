import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user.model';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RouterModule, Routes, NavigationExtras, Router } from '@angular/router';


@Component({
    moduleId: module.id,
    templateUrl: 'requestreset.component.html',
    styleUrls: ['requestreset.component.css']
})

export class RequestresetComponent {
    model = <User> {};
    loading = false;
    error = '';
    message: string;

    constructor(
        private authenticationService: AuthenticationService,
        private _flashMessagesService: FlashMessagesService,
        private _router: Router
         ) { }



    sendResetRequest()
    {
        this.authenticationService.sendResetRequest(this.model.email);
    }
}
