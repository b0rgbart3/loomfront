import { Component, OnInit, Output } from '@angular/core';
import { ClassService } from '../classes/class.service';
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
    courseImages: {} [];
    constructor (
        private userService: UserService,
        private classService: ClassService,
        private _router: Router,
        private globals: Globals,
        private courseService: CourseService ) {

    }

    ngOnInit() {
        this.test = true;
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
                        this.getClassesForCurrentUser();
                    },
                    error => this.errorMessage = <any>error);

            },
            error => this.errorMessage = <any>error);


    }

    getClassesForCurrentUser() {
        this.classService.getStudentClasses(this.currentUser.id).subscribe(
            studentClasses => { this.studentClasses = studentClasses;
                this.loadCourseImages(); },
            error => this.errorMessage = <any>error);

        // this.classObjects = [];
        // if (this.currentUser) {
        //     this.classIDs = this.classService.getClassesByStudentUserid(this.currentUser.id);

        //     if (this.classIDs && (this.classIDs.length > 0)) {
        //       for (let i = 0; i < this.classIDs.length; i++) {


        //             this.classService.getClass(this.classIDs[i]).subscribe(
        //             classObj => { this.classObjects.push(classObj);
        //                 console.log(this.classObjects[i]);
        //             },
        //             error => this.errorMessage = <any>error);
        //         }
        //     }
        // }
    }

    // This method builds an array of Course Images for the Classes that the student is enrolled in.
    loadCourseImages() {
        this.courseImages = [];
        let tempCourse = null;
        let tempCourseID = '';

        let tempCourseImageUrl = '';
        for (let i = 0; i < this.studentClasses.length; i++) {

            console.log(this.studentClasses[i].course);
            tempCourseID = this.studentClasses[i].course;
            tempCourse = this.courses.filter( obj => (obj.id === tempCourseID) );

            console.log('tempCourse: ' + JSON.stringify(tempCourse));

            tempCourseImageUrl = this.globals.courseimages + '/' + this.studentClasses[i].course + '/' + tempCourse[0].image;
            console.log(tempCourseImageUrl);

            this.studentClasses[i].courseObject = tempCourse;
            this.studentClasses[i].courseImageURL = tempCourseImageUrl;
            // The class stores the Course # as a reference,
            // and the course image is inside the course Object -
            // so we have to first load the Course Object, and then we can ref. the image

            // tempCourseID = this.studentClasses[i].course;
            // tempCourseImage = '';

            // console.log('tempCourseID' + tempCourseID);
            // this.courseImages[tempCourseID] = null;
            // this.courseService.getCourse(tempCourseID).subscribe(
            //     data =>  {tempCourse = data[0];
            //         console.log('got data: ' + JSON.stringify( data[0] ) );
            //         tempCourseImage = data[0].image;

            //         const courseImage = { 'id' : this.studentClasses[i].course };
            //         courseImage['image'] = this.globals.courseimages + '/' + this.studentClasses[i].course + '/' +
            //           tempCourseImage;

            //         this.courseImages.push(courseImage);
            //     },
            //     error => this.errorMessage = <any>error);



        }
    }

      goto( queryID ) {
          const queryString = '/classes/' + queryID;
        this._router.navigate( [queryString] );
      }
}
