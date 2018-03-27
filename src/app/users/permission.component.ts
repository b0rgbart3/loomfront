import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../models/user.model';
import { ClassModel } from '../models/class.model';
import { UserService } from '../services/user.service';
import { ClassService } from '../services/class.service';
import { Course } from '../models/course.model';
import { Assignment } from '../models/assignment.model';

@Component({
    templateUrl: 'permission.component.html',
    styleUrls: ['permission.component.css']
})

export class PermissionComponent implements OnInit {
    username;
    currentUser: User;
    classes: ClassModel[];
    courses: Course[];
    errorMessage: string;
    assignments: Assignment[];
    instructorsByClass: any[];

    constructor( private router: Router,
    private userService: UserService, private classService: ClassService,
    private activated_route: ActivatedRoute ) {

        }

        login() {
           this.router.navigate(['/login']);
        }

        ngOnInit() {
        }
    }
