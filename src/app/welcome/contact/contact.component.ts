import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RouterModule, Routes, NavigationExtras, Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgForm, FormControl, FormBuilder,
    FormGroup, FormArray, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Reset } from '../../models/reset.model';
import { ContactService } from '../../services/contact.service';
import { CFMessage } from '../../models/cfmessage.model';

@Component({
    moduleId: module.id,
    templateUrl: 'contact.component.html',
    styleUrls: ['contact.component.css']
})



export class ContactComponent implements OnInit {

    contactForm: FormGroup;
    cfMessage: CFMessage;
    confirmation: string;

    constructor(private formBuilder: FormBuilder, private contactService: ContactService) {}
    ngOnInit() {
        this.confirmation = '';
        this.contactForm = this.formBuilder.group( {
            firstname: ['' ],
            lastname: ['' ],
            email: ['' ],
            phone: ['' ],
            message: [ '', ]});

    }

    sendMsg() {
        if (this.contactForm.dirty && this.contactForm.valid) {
            this.cfMessage = this.contactForm.value;
            console.log(this.contactForm.value);
            this.contactService.sendMsg( this.cfMessage ).subscribe(
                response => { console.log('Response == '); console.log( JSON.stringify( response) );
                if (response) {
                    this.confirmation = 'success';
                }
            },
            );
        }
    }
}
