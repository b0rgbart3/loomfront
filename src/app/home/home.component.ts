import { Component, OnInit, Output } from '@angular/core';
import { ClassService } from '../services/class.service';
import { User } from '../models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { Course } from '../models/course.model';
import { ClassModel } from '../models/class.model';
import { Globals } from '../globals';
import { CourseService } from '../services/course.service';
import { Enrollment } from '../models/enrollment.model';


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
    studentenrollments: Enrollment[];
    instructorassignments: Enrollment[];

    constructor (
        private userService: UserService,
        private classService: ClassService,
        private _router: Router,
        private globals: Globals,
        private courseService: CourseService,
        private activated_route: ActivatedRoute ) {
    }

    ngOnInit() {

        console.log('In Home Component Init');
        this.showTabs = true;
        this.showTaking = true;
        this.showTeaching = false;
        this.takingLabel = 'tabLabelChosen';
        this.teachingLabel = 'tabLabel';

        // Get the student enrollment objects for the current user
        this.studentenrollments = this.activated_route.snapshot.data['studentenrollments'];

        // extract out just the ID's into an array
        if (this.studentenrollments) {
        this.classesTakingIDList = this.studentenrollments.map( enrollment => enrollment.class_id); }

        console.log('Classes Taking ID List: ' + JSON.stringify(this.classesTakingIDList));

        // Ask the class service for a class object for each id in that array
        if (this.classesTakingIDList && this.classesTakingIDList.length > 0) {
        this.classesTaking = this.classesTakingIDList.map( classID => this.classService.getClassFromMemory(classID) );
        } else {
            this.classesTaking = null;
        }
        console.log('TAKING: ' + JSON.stringify(this.classesTaking));

        this.instructorassignments = this.activated_route.snapshot.data['instructorassignments'];

        if (this.instructorassignments) {
        this.classesTeachingIDList = this.instructorassignments.map( assignment => assignment.class_id); }

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
        // this.currentUser = this.userService.getCurrentUser();
        // if (this.currentUser) {
        // this.username = this.currentUser.username; } else {
        //     this.username = '';
        // }
       // this.classObjects = [];
        // this.instructorClassObjects = [];
        // this.classService.getClasses().subscribe(
        //     classes => {this.classes = classes;
        //         console.log('got classes ');
        //         this.courseService.getCourses().subscribe(
        //             courses => {
        //                 this.courses = courses;
        //                 console.log('loaded all the coureses.');
        //                 if (this.currentUser) {
        //                     this.getClassesForCurrentUser(); }
        //             },
        //             error => this.errorMessage = <any>error);

        //     },
        //     error => this.errorMessage = <any>error);
        // console.log('end of home component init method.');
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
    // getClassesForCurrentUser() {
    //   //  console.log('getting classes for the user');

    //     if (this.currentUser) {
    //        console.log('we have a current user: ' + this.currentUser.id );
    //     this.classService.getStudentClasses(this.currentUser.id).subscribe(
    //         studentClasses => {
    //             console.log('Got classes for students: ' + JSON.stringify(studentClasses));
    //             this.studentClasses = studentClasses;
    //             this.loadCourseImages(); },
    //         error => console.log(error));

    //     this.classService.getInstructorClasses(this.currentUser.id).subscribe(
    //         instructorClasses => {
    //            // console.log('Got classes for instructors.' + JSON.stringify(instructorClasses));
    //             this.instructorClasses = instructorClasses;
    //             this.loadCourseImagesForInstructors(); },
    //         error => this.errorMessage = <any>error);
    // }}

    // This method builds an array of Course Images for the Classes that the student is enrolled in.
    // I wish this was done in the Course Service - or Class Service - but alas, it is not.
    // loadCourseImages() {
    //     this.courseImages = [];
    //     let tempCourse = null;
    //     let tempCourseID = '';

    //     let tempCourseImageUrl = '';
    //     for (let i = 0; i < this.studentClasses.length; i++) {

    //         // console.log(this.studentClasses[i].course);
    //         tempCourseID = this.studentClasses[i].course;

    //         /*  I'm using the fully loaded courses array, to look for a course with this ID #.
    //         */
    //         tempCourse = this.courses.filter( obj => (obj.id === tempCourseID) );


    //         tempCourseImageUrl = this.globals.courseimages + '/' + this.studentClasses[i].course + '/' + tempCourse[0].image;

    //         this.studentClasses[i].courseImageURL = tempCourseImageUrl;
    //         this.courseService.getCourse(this.studentClasses[i].course).subscribe(
    //           course => {
    //             this.studentClasses[i].courseObject = course[0];
    //             // this.studentClasses[i].description = course[0].description;

    //           },
    //           error => this.errorMessage = <any>error);

    //     }

    // }

    // loadCourseImagesForInstructors() {
    //     this.courseImages = [];
    //     let tempCourse = null;
    //     let tempCourseID = '';

    //     let tempCourseImageUrl = '';
    //     for (let i = 0; i < this.instructorClasses.length; i++) {

    //         // console.log(this.studentClasses[i].course);
    //         tempCourseID = this.instructorClasses[i].course;

    //         /*  I'm using the fully loaded courses array, to look for a course with this ID #.
    //         */
    //         tempCourse = this.courses.filter( obj => (obj.id === tempCourseID) );

    //         tempCourseImageUrl = this.globals.courseimages + '/' + this.instructorClasses[i].course + '/' + tempCourse[0].image;

    //         this.instructorClasses[i].courseImageURL = tempCourseImageUrl;
    //         this.courseService.getCourse(this.instructorClasses[i].course).subscribe(
    //           course => {
    //             this.instructorClasses[i].courseObject = course[0];
    //             // this.instructorClasses[i].description = course[0].description;

    //           },
    //           error => this.errorMessage = <any>error);

    //     }
    // }

      goto( queryID ) {
          const queryString = '/classes/' + queryID + '/0';
          console.log('Routing to: ' + queryString );
        this._router.navigate( [queryString] );
      }
}
