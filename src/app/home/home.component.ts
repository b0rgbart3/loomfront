import { Component, OnInit, Output } from '@angular/core';
import { ClassService } from '../services/class.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Course } from '../models/course.model';
import { ClassModel } from '../models/class.model';
import { Globals } from '../globals';
import { CourseService } from '../courses/course.service';



@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {

    test: true;
    currentUser: User;
    username: string;
    classes: ClassModel[];
    classIDs: string[];
   // classObjects: Object[];
    courses: Course[];
    instructorClassObjects: Object[];
    regClassIds: string[];
    instructorClassIds: string[];
    errorMessage: string;
    studentClasses: ClassModel[];
    instructorClasses: ClassModel[];
    courseImages: {} [];
    showTaking: boolean;
    showTeaching: boolean;
    takingLabel: string;
    teachingLabel: string;

    constructor (
        private userService: UserService,
        private classService: ClassService,
        private _router: Router,
        private globals: Globals,
        private courseService: CourseService ) {

    }

    ngOnInit() {
        this.test = true;
        this.showTaking = true;
        this.showTeaching = false;
        this.takingLabel = 'tabLabelChosen';
        this.teachingLabel = 'tabLabel';
        this.currentUser = this.userService.getCurrentUser();
        if (this.currentUser) {
        this.username = this.currentUser.username; } else {
            this.username = '';
        }
       // this.classObjects = [];
        this.instructorClassObjects = [];
        this.classService.getClasses().subscribe(
            classes => {this.classes = classes;
                this.courseService.getCourses().subscribe(
                    courses => {
                        this.courses = courses;
                        // console.log('loaded all the coureses.');
                        if (this.currentUser) {
                            this.getClassesForCurrentUser(); }
                    },
                    error => this.errorMessage = <any>error);

            },
            error => this.errorMessage = <any>error);
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
    getClassesForCurrentUser() {
      //  console.log('getting classes for the user');

        if (this.currentUser) {
         //   console.log('we have a current user: ' + this.currentUser.id );
        this.classService.getStudentClasses(this.currentUser.id).subscribe(
            studentClasses => {
               // console.log('Got classes for students: ' + JSON.stringify(studentClasses));
                this.studentClasses = studentClasses;
                this.loadCourseImages(); },
            error => this.errorMessage = <any>error);

        this.classService.getInstructorClasses(this.currentUser.id).subscribe(
            instructorClasses => {
               // console.log('Got classes for instructors.' + JSON.stringify(instructorClasses));
                this.instructorClasses = instructorClasses;
                this.loadCourseImagesForInstructors(); },
            error => this.errorMessage = <any>error);
    }}

    // This method builds an array of Course Images for the Classes that the student is enrolled in.
    // I wish this was done in the Course Service - or Class Service - but alas, it is not.
    loadCourseImages() {
     //   console.log('loading course images');
        this.courseImages = [];
        let tempCourse = null;
        let tempCourseID = '';

        let tempCourseImageUrl = '';
        for (let i = 0; i < this.studentClasses.length; i++) {

            console.log(this.studentClasses[i].course);
            tempCourseID = this.studentClasses[i].course;

            /*  I'm using the fully loaded courses array, to look for a course with this ID #.
            */
            tempCourse = this.courses.filter( obj => (obj.id === tempCourseID) );

           // console.log('tempCourse: ' + JSON.stringify(tempCourse));

            tempCourseImageUrl = this.globals.courseimages + '/' + this.studentClasses[i].course + '/' + tempCourse[0].image;
            // console.log(tempCourseImageUrl);

            this.studentClasses[i].courseObject = tempCourse;
            this.studentClasses[i].courseImageURL = tempCourseImageUrl;

        }
      //  console.log('Done loading course images.');
    }

    loadCourseImagesForInstructors() {

    }

      goto( queryID ) {
          const queryString = '/classes/' + queryID + '/0';
        this._router.navigate( [queryString] );
      }
}
