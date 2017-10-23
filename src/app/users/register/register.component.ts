import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { NgForm, FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { UserService } from '../user.service';
import { AlertService } from '../../services/alert.service';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.css']
})

export class RegisterComponent implements OnInit {

    startDate = new Date();
    hasPrimaryLanguageError = false;
    date2 = new Date();
    errorMessage: string;
    users;
    user: User;
    currentUser: User;
    admin: boolean;
    editSelf: boolean;
    makeTeacher: boolean;
    isInstructor: boolean;
    checkBox: FormControl;
    regFormGroup: FormGroup;

    constructor(
      public userService: UserService,
      private router: Router,
      private alertService: AlertService,
      private _flashMessagesService: FlashMessagesService,
      private activated_route: ActivatedRoute,
      private fb: FormBuilder) {
      }

    ngOnInit() {

      const id = this.activated_route.snapshot.params['id'];
      if (id) {
              this.user = this.activated_route.snapshot.data['user'][0]; }
      this.users = this.activated_route.snapshot.data['users'];

      if (this.user && this.user.instructor) {
        this.isInstructor = true;
      }

      this.admin = false;
      this.editSelf = false;
      this.currentUser = this.userService.getCurrentUser();
      if (this.user && this.user.id && (this.currentUser.id === this.user.id)) {
        this.editSelf = true;
      }
      if (this.currentUser && this.currentUser.admin) {
        this.admin = true;
      }

      if (!this.user) {
        this.user = new User('', '', '', '', '', '', '', '', '', true, false, false , [], '', '', '', '', [], [], [] );
      }
      this.regFormGroup = this.fb.group( {
        firstname: [this.user.firstname, [ Validators.required, Validators.maxLength(20), ] ],
        lastname: [this.user.lastname, [ Validators.required, Validators.maxLength(40)] ],
        email: [this.user.email, [ Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')] ],
        username: [this.user.username, [ Validators.required ]],
        // password: [this.user.password, [Validators.required,
        //   Validators.pattern('^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$')]]
        password: [ this.user.password, [ Validators.required,
          Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
          student: this.user.student,
        instructor: this.user.instructor,
        admin: this.user.admin
      });

    }
    // The user filled out and submitted the Registration form.

    cancel() {
      this.router.navigate(['/welcome']);
    }
    registerUser() {
      if (this.regFormGroup.dirty && this.regFormGroup.valid) {

                    // This is Deborah Korata's way of merging our data model with the form model
                     const combinedObject = Object.assign( {}, this.user, this.regFormGroup.value);

        if (this.user.id === '0') {

          console.log('About to create a new user');

        this.userService.createUser( combinedObject ).subscribe(
          (val) => { console.log('POST call successful value returned in body ', val);
            this.router.navigate(['/welcome']); },
          response => {console.log('POST call in error', response); },
          () => {console.log('The POST observable is now completed.');
            this.alertService.success('Thank you for registering with the Reclaiming Loom. ' +
              ' Now, please check your email, and use the verification code to verify your account.  Thank you.', true);
              this.router.navigate(['/welcome']);  });
        } else {
          this.userService
          .updateUser( combinedObject ).subscribe(
          (val) => {
            console.log('POST call successful value returned in body ', val);
          },
          response => {
            console.log('POST call in error', response);
          },
          () => {
            console.log('The POST observable is now completed.');

            if (this.userService.isAdmin() ) {
              this.router.navigate(['/admin']);
            } else {
              this.alertService.success('Your account info has been updated.', true);

              this.router.navigate(['/welcome']);
              }
            }
          );
        }
    }else {
      console.log(this.regFormGroup.get('password').valid);
    }
  }

}


