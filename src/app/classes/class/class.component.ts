import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseService } from '../../courses/course.service';
import { User } from '../../models/user.model';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassModel } from '../../models/class.model';
import { ClassService } from '../class.service';
const COURSE_IMAGE_PATH = 'http://localhost:3100/courseimages';

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

    constructor( private activated_route: ActivatedRoute,
    private classService: ClassService,
    private courseService: CourseService ) {}

    ngOnInit() {
        this.classService
        .getClasses().subscribe(
          classes =>  {this.classes = classes;
        this.continueInit(); },
          error => this.errorMessage = <any>error);

    }

    continueInit() {
        console.log('In continueInit() ');

        const id = this.activated_route.snapshot.params['id'];
        this.classID = id;
        this.thisClass = this.classService.getClassFromMemory(id);

        // this.courseimageUrl = COURSE_IMAGE_PATH + '?id=' + id;
        console.log(id);
        console.log(JSON.stringify(this.thisClass));
        this.courseID = this.thisClass.course;


        // this.courseService.loadCourseImage( this.courseID ).subscribe(
        //     courseimage => { console.log(' got courseimage back from the server. ');
        //     const thecourseimage = courseimage[0];
        //     const thecourseimageURL = 'http://localhost:3100/courseimages/' + this.courseID + '/' + thecourseimage.filename;
        //     console.log('this courseimage image: ' + thecourseimageURL);
        //     return(thecourseimageURL); },
        //     error => this.errorMessage = <any> error );


        console.log(this.courseID);

        this.courseService.getCourse(this.courseID).subscribe(
            course =>  {this.course = course[0];
            // console.log( JSON.stringify (this.course) );
            // console.log( JSON.stringify( this.course.sections ));
            console.log( 'Course image: ' + this.course.image);
            this.courseimageURL = 'http://localhost:3100/courseimages/' + this.courseID + '/' + this.course.image;

        },
            error => this.errorMessage = <any>error);

        // this.courseService.getCourseImage(this.courseID).subscribe(
        //         courseimage =>  {this.courseimage = courseimage[0];
        //         console.log( 'course iamge: ' + JSON.stringify (this.courseimage) );
        //     },
        //         error => this.errorMessage = <any>error);
    }
}

