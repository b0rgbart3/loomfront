import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseService } from '../../courses/course.service';
import { User } from '../../models/user.model';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassModel } from '../../models/class.model';
import { ClassService } from '../class.service';
import { UserService } from '../../users/user.service';
import { Classregistrationgroup } from '../../models/classregistrationgroup.model';
import { Classregistration } from '../../models/classregistration.model';
import { Userchartobject } from '../../models/userchartobject.model';
const COURSE_IMAGE_PATH = 'http://localhost:3100/courseimages';
const AVATAR_IMAGE_PATH = 'http://localhost:3100/avatars/';

@Component({

  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css'],
  providers: [CourseService]
})

export class ClassComponent implements OnInit {

    classID: string;
    thisClass: ClassModel;
    errorMessage: string;
    courseID: string;
    classes: ClassModel[];
    course: Course;
    courseimageURL: string;
    users: User[];
    registry: Classregistrationgroup;
    regs: Classregistration[];
    instructors: Classregistration[];
    instructorChart: Object[];
    studentChart: Object[];
    userChart: Userchartobject[];

    constructor( private activated_route: ActivatedRoute,
    private classService: ClassService,
    private courseService: CourseService,
    private userService: UserService ) {}

    ngOnInit() {
        this.userService.subscribeToUsers();
        this.userService.subscribeToAvatars();
        this.classService
        .getClasses().subscribe(
          classes =>  {this.classes = classes;
        this.continueInit(); },
          error => this.errorMessage = <any>error);

    }

    continueInit() {
        const id = this.activated_route.snapshot.params['id'];
        this.classID = id;
        this.thisClass = this.classService.getClassFromMemory(id);
        this.courseID = this.thisClass.course;
        this.courseService.getCourse(this.courseID).subscribe(
            course =>  {this.course = course[0];
            this.courseimageURL = 'http://localhost:3100/courseimages/' + this.courseID + '/' + this.course.image;

        },
            error => this.errorMessage = <any>error);

        this.userService
        .getUsers().subscribe(
          users => { this.users = users;
            // console.log ('Got the users' );
            this.classService.getClassRegistry( this.thisClass.id )
            .subscribe( registry => { this.registry = registry[0];
                // this.regs = this.registry[0].regs;
                // console.log ( '#of regs: ' + this.regs.length );

                    // console.log ('Got the registry: ' + JSON.stringify(this.registry));
                    this.regs = this.registry.regs;
                    this.instructors = this.registry.instructors;
                    // console.log ('The REGS: ' + this.regs);
                    this.populateForm(); },
            error => this.errorMessage = <any>error); },
            error => this.errorMessage = <any>error);

    }

        populateForm() {
       console.log('In pop form: instructors: ' + JSON.stringify( this.instructors) );
       this.userChart = this.userService.buildUserChart();

       console.log('In pop form: regs: userChart: ' + JSON.stringify( this.userChart) );

      this.createStudentChart();
      this.createInstructorChart();


    }

    createStudentChart() {
        this.studentChart = [];
        for (let j = 0; j < this.regs.length; j++) {
 
            const thisStudentObject = { 'id' : '', 'username' : '', 'avatarURL': ''};
            if (this.userChart) {
             console.log('building student chart: userChart length: ' + this.userChart.length);
             thisStudentObject.id = this.regs[j].userid;
 
             let foundUserChartObject = {};
             let foundChartIndex = -1;
 
             for (let k = 0; k < this.userChart.length; k++) {
                 if (this.userChart[k].id === this.regs[j].userid) {
                     foundUserChartObject = this.userChart[k];
                     foundChartIndex = k;
                     console.log('Found username: ' + this.userChart[foundChartIndex].username);
                     console.log('found: foundChartIndex=' + foundChartIndex);
                 }
             }
             if (foundChartIndex !== -1) {
             console.log('Pushing: ' + this.userChart[foundChartIndex].username);
             thisStudentObject.username = this.userChart[foundChartIndex].username;
             thisStudentObject.avatarURL = this.userChart[foundChartIndex].avatarURL;
             this.studentChart.push(thisStudentObject);
              }
            }
        }
 
        console.log( 'Student Chart: ' + JSON.stringify(this.studentChart ));
    }
    createInstructorChart() {
        this.instructorChart = [];
        for (let j = 0; j < this.instructors.length; j++) {
 
            const thisInstructorObject = { 'id' : '', 'username' : '', 'avatarURL': ''};
            if (this.userChart) {
             // console.log('building instructor chart: userChart length: ' + this.userChart.length);
             thisInstructorObject.id = this.instructors[j].userid;
 
             let foundUserChartObject = {};
             let foundChartIndex = -1;
 
             for (let k = 0; k < this.userChart.length; k++) {
                 if (this.userChart[k].id === this.instructors[j].userid) {
                     foundUserChartObject = this.userChart[k];
                     foundChartIndex = k;
                     // console.log('Found username: ' + this.userChart[foundChartIndex].username);
                     // console.log('found: foundChartIndex=' + foundChartIndex);
                 }
             }
             if (foundChartIndex !== -1) {
             console.log('Pushing: ' + this.userChart[foundChartIndex].username);
             thisInstructorObject.username = this.userChart[foundChartIndex].username;
             thisInstructorObject.avatarURL = this.userChart[foundChartIndex].avatarURL;
             this.instructorChart.push(thisInstructorObject);
              }
            }
        }
 
       //  console.log( 'Student Chart: ' + JSON.stringify(this.instructorChart ));
    }
}

