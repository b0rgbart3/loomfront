import { Component, OnInit, Output } from '@angular/core';
import { ClassService } from '../services/class.service';
import { User } from '../models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { Course } from '../models/course.model';
import { ClassModel } from '../models/class.model';
import { Globals } from '../globals2';
import { CourseService } from '../services/course.service';
import { Enrollment } from '../models/enrollment.model';
import { Assignment } from '../models/assignment.model';
import { LoomNotificationsService } from '../services/loom.notifications.service';
import { LoomNotification } from '../models/loom.notification.model';


@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {

    errorMessage: string;
    showTaking: boolean;
    showTeaching: boolean;
    showTabs: boolean;
    takingLabel: string;
    teachingLabel: string;
    classesTakingIDList: string[];
    classesTaking: ClassModel[];
    classesTeachingIDList: string[];
    classesTeaching: ClassModel[];
    enrollments: Enrollment[];
    assignments: Assignment[];

    constructor (
        private userService: UserService,
        private classService: ClassService,
        private _router: Router,
        private globals: Globals,
        private courseService: CourseService,
        private activated_route: ActivatedRoute,
        private _notes: LoomNotificationsService ) {
    }

    ngOnInit() {

        console.log('In Home Component Init');
        this.showTabs = true;
        this.showTaking = true;
        this.showTeaching = false;
        this.takingLabel = 'tabLabelChosen';
        this.teachingLabel = 'tabLabel';

        // Get the student enrollment objects for the current user
        this.enrollments = this.activated_route.snapshot.data['enrollments'];

        // extract out just the ID's into an array
        if (this.enrollments) {
        this.classesTakingIDList = this.enrollments.map( enrollment => enrollment.class_id); }

     //   console.log('Classes Taking ID List: ' + JSON.stringify(this.classesTakingIDList));

        // Ask the class service for a class object for each id in that array
        if (this.classesTakingIDList && this.classesTakingIDList.length > 0) {
        this.classesTaking = this.classesTakingIDList.map( classID => this.classService.getClassFromMemory(classID) );
        } else {
            this.classesTaking = null;
        }
     //   console.log('TAKING: ' + JSON.stringify(this.classesTaking));

        this.assignments = this.activated_route.snapshot.data['assignments'];

        if (this.assignments) {
        this.classesTeachingIDList = this.assignments.map( assignment => assignment.class_id); }

        if (this.classesTeachingIDList && this.classesTeachingIDList.length > 0 ) {
        this.classesTeaching = this.classesTeachingIDList.map( classID => this.classService.getClassFromMemory(classID));
        } else {
            this.classesTeaching = null;
        }



        if ((this.classesTaking === null) && ( this.classesTeaching !== null) ) {
            this.showTeaching = true;
            this.showTabs = false;
        }

        if ((this.classesTeaching === null) && (this.classesTaking !== null)) {
            this.showTaking = true;
            this.showTabs = false;
        }

        if ((!this.classesTaking) && (this.classesTeaching === null)) {
            this.showTaking = false;
            this.showTabs = false;
            this.showTeaching = false;

        }

        if (!this.showTeaching && !this.showTaking) {
            this._router.navigate(['/']);
            const thisNotification = new LoomNotification('success',
            ['You are not yet registered for classes'], 3000);
            this._notes.add( thisNotification );
        }
    }


    taking() {
        // console.log('change to taking.');
        this.showTaking = true;
        this.showTeaching = false;
        this.takingLabel = 'tabLabelChosen';
        this.teachingLabel = 'tabLabel';
    }
    teaching() {
        // console.log('change to teaching.');
        this.showTaking = false;
        this.showTeaching = true;
        this.takingLabel = 'tabLabel';
        this.teachingLabel = 'tabLabelChosen';
    }


      goto( queryID ) {
          const queryString = '/classes/' + queryID + '/0';
   //       console.log('Routing to: ' + queryString );
        this._router.navigate( [queryString] );
      }
}
