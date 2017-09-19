import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { FormPoster } from '../../services/form-poster.service';
import { NgForm } from '@angular/forms';

import { UserService } from '../user.service';
import { AlertService } from '../../services/alert.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.css']
})

export class RegisterComponent {

    startDate = new Date();

    model = new User('', '', '', '', '', '');
    hasPrimaryLanguageError = false;
    date2 = new Date();

    errorMessage: string;

    constructor(
      private userService: UserService,
      private  router: Router,
      private alertService: AlertService,
      private _flashMessagesService: FlashMessagesService ) { }

    // The user filled out and submitted the Registration form.

    registerUser(form: NgForm) {

        console.log('REGISTER:');
        console.log(this.model);

        // Validate stuff here
        this.userService
        .postUser( this.model ).subscribe(
        (val) => {
          console.log('POST call successful value returned in body ', val);
        },
        response => {
          console.log('POST call in error', response);
        },
        () => {
          console.log('The POST observable is now completed.');
          this.alertService.success('Thank you for registering with the Reclaiming Loom. '+
          ' Now, please check your email, and use the verification code to verify your account.  Thank you.', true);
          // this._flashMessagesService.show('Username or password was incorrect.', 
          // { cssClass: 'alert-warning', timeout: 7000 });
          this.router.navigate(['/welcome']);
        }
      );


    }
}
