import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RouterModule, Routes, NavigationExtras, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgForm, FormControl, FormBuilder,
    FormGroup, FormArray, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Reset } from '../../models/reset.model';
  

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
    resetForm: FormGroup;
    resetObject: Reset;

    constructor(
        private userService: UserService,
        private _flashMessagesService: FlashMessagesService,
        private _router: Router,
        private formBuilder: FormBuilder
         ) { }


    ngOnInit() {

        this.resetForm = this.formBuilder.group( {
            email: [ '' , [ Validators.required ] ],
            password: ['', [ Validators.required ] ],
            password_confirmation: ['', [ Validators.required ]] });
    }

    sendReset() {
        // Complete the circle - but sending this reset request BACK to the API

        this.userService
          .resetPassword( this.resetForm.value ).subscribe(
          (val) => {
            console.log('POST call successful value returned in body ', val);
          },
          response => {
            console.log('POST call in error', response);
          },
          () => {
            console.log('The POST observable is now completed.');
            }
          );
    }

}

