import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RouterModule, Routes, NavigationExtras, Router } from '@angular/router';
import { UserService } from '../../services/user.service';


@Component({
    moduleId: module.id,
    templateUrl: 'reset.component.html',
    styleUrls: ['reset.component.css']
})

export class ResetComponent implements OnInit {
    model = <User> {};
    loading = false;
    error = '';
    message: string;

    constructor(
        private userService: UserService,
        private _flashMessagesService: FlashMessagesService,
        private _router: Router
         ) { }


    ngOnInit() {

    }

}
