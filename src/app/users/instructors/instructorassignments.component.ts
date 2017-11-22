import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { NgForm, FormGroup, FormBuilder } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
    moduleId: module.id,
    templateUrl: 'instructorassignments.component.html',
})

export class InstructorAssignmentsComponent implements OnInit {

    startDate = new Date();
    form: FormGroup;
    users: User[];

    constructor( private fb: FormBuilder, private activated_route: ActivatedRoute  ) {
    }

    ngOnInit() {
        this.users = this.activated_route.snapshot.data['users'];
        console.log('Users: ' + JSON.stringify(this.users));

        this.form = this.fb.group({
            user: ''
        });
    }
}
