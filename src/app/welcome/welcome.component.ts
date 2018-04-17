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
    templateUrl: 'welcome.component.html',
    styleUrls: ['welcome.component.css']
})

export class WelcomeComponent implements OnInit {
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
            // console.log('snapshot: ' + JSON.stringify(this.activated_route.snapshot.data));
            this.currentUser = this.userService.getCurrentUser();
            console.log('In Welcome, currentUser: ' + JSON.stringify(this.currentUser));
            this.classes = [];
            this.activated_route.data.subscribe(
                data => {
                 //   console.log('got data: ' + JSON.stringify(data));
                    this.grabData();
            }, err => {
               // console.log('error retrieving data');
            }, () => {
               // console.log('Data finished: ');
                this.grabData();
            }
        );

        }

        grabData() {
            this.courses = this.activated_route.snapshot.data['courses'];
            this.classes = this.activated_route.snapshot.data['classes'];
            // console.log('Classes: ' + JSON.stringify(this.classes));
            this.assignments = this.activated_route.snapshot.data['assignments'];
            this.loadInstructors();
        }
        loadInstructors() {
            this.instructorsByClass = [];

            if (this.classes) {
                for (let i = 0; i < this.classes.length; i++) {
                    this.instructorsByClass[i] = [];
                    this.userService.getInstructorsForClass(this.classes[i].id).subscribe( data => this.instructorsByClass[i] = data,
                    err => console.log('error getting instructors') );
                }
                for (let i = 0; i < this.instructorsByClass.length; i++) {
                    // these are assignment objects
                    for (let j = 0; j < this.instructorsByClass[i].length; j++) {
                        this.instructorsByClass[i][j].user = this.userService.getUserFromMemoryById(this.instructorsByClass[i][j].user_id);
                    }
                }
            }
        }
}
