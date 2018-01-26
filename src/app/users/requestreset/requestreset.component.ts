import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RouterModule, Routes, NavigationExtras, Router } from '@angular/router';
import { UserService } from '../../services/user.service';


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
        private userService: UserService,
        private _flashMessagesService: FlashMessagesService,
        private _router: Router
         ) { }



    sendResetRequest() {
        this.userService.sendResetRequest(this.model.email).subscribe(
            (value) => console.log(JSON.stringify(value)) ,
        (error) => console.log('Error: ' + JSON.stringify(error) ) );
    }
}
