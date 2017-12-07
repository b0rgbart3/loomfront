import { Component, OnInit, Output } from '@angular/core';
import { ClassService } from '../classes/class.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Course } from '../models/course.model';
import { ClassModel } from '../models/class.model';



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
    classObjects: Object[];
    courses: Course[];
    instructorClassObjects: Object[];
    regClassIds: string[];
    instructorClassIds: string[];
    errorMessage: string;

    constructor (
        private userService: UserService,
      private classService: ClassService,
    private _router: Router) {

    }

    ngOnInit() {
        this.test = true;
        this.currentUser = this.userService.getCurrentUser();
        if (this.currentUser) {
        this.username = this.currentUser.username; } else {
            this.username = '';
        }
        this.classObjects = [];
        this.instructorClassObjects = [];
        this.classService.getClasses().subscribe(
            classes => {this.classes = classes;
                this.getClassesForCurrentUser(); },
            error => this.errorMessage = <any>error);

        this.loadCourseImages();
    }

    getClassesForCurrentUser() {
        this.classService.getStudentClasses(this.currentUser.id);
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

    loadCourseImages() {
        for (let i = 0; i < this.classObjects.length; i++) {

        }
    }
      goto( queryID ) {
          const queryString = '/classes/' + queryID;
        this._router.navigate( [queryString] );
      }
}
