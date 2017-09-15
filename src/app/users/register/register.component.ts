import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { FormPoster } from '../../services/form-poster.service';
import { NgForm } from '@angular/forms';

import { UserService } from '../user.service';

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.css']
})

export class RegisterComponent {

    startDate = new Date();

    model = new User('', '', '', '', '');
    hasPrimaryLanguageError = false;
    date2 = new Date();

    errorMessage: string;

    constructor(private userService: UserService, private  router: Router ) { }

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
          this.router.navigate(['/home']);
        }
      );


    }
}
