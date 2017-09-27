import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { NgForm } from '@angular/forms';

import { UserService } from '../user.service';
import { AlertService } from '../../services/alert.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.css']
})

export class RegisterComponent implements OnInit {

    startDate = new Date();

    // model = new User('', '', '', '', '', '', '', 'false', '', '0');
    hasPrimaryLanguageError = false;
    date2 = new Date();
    errorMessage: string;
    user: User; // = new User('', '', '', '', '', '', '', 'false', '', '', '0');

    constructor(
      public userService: UserService,
      private router: Router,
      private alertService: AlertService,
      private _flashMessagesService: FlashMessagesService,
      private authenticationService: AuthenticationService,
      private activated_route: ActivatedRoute, ) {

        this.userService.getUsers();

      }

    ngOnInit() {
      console.log('ngOnInit()');

      this.user = new User ( '', '', '', '', '', '', '', 'false', '', '', '0');

      const id = +this.activated_route.snapshot.params['id'];

      if (id && id !== 0) {
         console.log('In the edit component, id was not zero: ' + id);

         this.getUser(id);
      }
    }
    // The user filled out and submitted the Registration form.

    registerUser(form: NgForm) {

        console.log('REGISTER:');
        console.log(this.user);

        if (this.user.id === '0') {

          console.log('About to create a new user');

        this.userService
          .createUser( this.user ).subscribe(
          (val) => {
            console.log('POST call successful value returned in body ', val);
          },
          response => {
            console.log('POST call in error', response);
          },
          () => {
            console.log('The POST observable is now completed.');

            if (this.authenticationService.isAdmin() ) {
              this.router.navigate(['/admin']);
            } else {
              this.alertService.success('Thank you for registering with the Reclaiming Loom. ' +
              ' Now, please check your email, and use the verification code to verify your account.  Thank you.', true);

              this.router.navigate(['/welcome']);
              }
             }
          );
        } else {
          this.userService
          .updateUser( this.user ).subscribe(
          (val) => {
            console.log('POST call successful value returned in body ', val);
          },
          response => {
            console.log('POST call in error', response);
          },
          () => {
            console.log('The POST observable is now completed.');

            if (this.authenticationService.isAdmin() ) {
              this.router.navigate(['/admin']);
            } else {
              this.alertService.success('Your account info has been updated.', true);

              this.router.navigate(['/welcome']);
              }
            }
          );
        }
    }



    getUser(id: number) {
      console.log('ID: ' + id);
      this.userService.getUser(id).subscribe(
        userObject => {this.user = <User>userObject[0]; console.log('got class info :' +
                          JSON.stringify(userObject) );


                         // console.log('Getting the class Object: ' + JSON.stringify( this.thisClass ) );

                       },
          error => this.errorMessage = <any> error
      );
  }
}


