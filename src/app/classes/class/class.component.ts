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
    instructorAvatarArray: string[];
    studentAvatarArray: string[];

    constructor( private activated_route: ActivatedRoute,
    private classService: ClassService,
    private courseService: CourseService,
    private userService: UserService ) {}

    ngOnInit() {
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
       // console.log('In pop form');
       this.studentAvatarArray = [];
       for (let j = 0; j < this.regs.length; j++) {
           this.userService.getAvatar(this.regs[j].userid).subscribe(
               (avatar) => { // console.log('Avatar:' + avatar[0].filename );
               const avatarURL = AVATAR_IMAGE_PATH + this.regs[j].userid + '/' + avatar[0].filename;
                   this.studentAvatarArray.push( avatarURL );
               },
               (error) => this.errorMessage = <any>error);
       }
        this.instructorAvatarArray = [];
        for (let i = 0; i < this.instructors.length; i++) {
            this.userService.getAvatar(this.instructors[i].userid).subscribe(
                (avatar) => { // console.log('Avatar:' + avatar[0].filename );
                const avatarURL = AVATAR_IMAGE_PATH + this.instructors[i].userid + '/' + avatar[0].filename;
                    this.instructorAvatarArray.push( avatarURL );
                },
                (error) => this.errorMessage = <any>error);
        }
    }
}

