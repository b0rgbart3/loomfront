import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../models/user.model';
import { ClassModel } from '../models/class.model';
import { UserService } from '../services/user.service';
import { ClassService } from '../services/class.service';


@Component({
    templateUrl: 'welcome.component.html',
    styleUrls: ['welcome.component.css']
})

export class WelcomeComponent implements OnInit {
    username;
    currentUser: User;
    classes: ClassModel[];
    errorMessage: string;
    dataConnection: boolean;

    constructor( private router: Router,
    private userService: UserService, private classService: ClassService ) {

        }

        login() {
           this.router.navigate(['/login']);
        }

        ngOnInit() {
            this.dataConnection = false;
            this.classService
            .getClasses().subscribe(
              classes =>  { this.classes = classes; this.dataConnection = true; console.log('gotback'); },
              error => this.errorMessage = <any>error);

            this.currentUser = this.userService.getCurrentUser();

            if (this.currentUser) {
                this.router.navigate(['/home']);
            this.username = this.currentUser.username; } else {
                this.username = '';
            }

        }


}
