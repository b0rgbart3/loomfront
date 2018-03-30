import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { NgForm, FormControl, FormBuilder,
  FormGroup, FormArray, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Globals } from '../../globals';
import { UserService } from '../../services/user.service';
import { ClassService } from '../../services/class.service';
import { ClassModel } from '../../models/class.model';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.css']
})

export class RegisterComponent implements OnInit {

    requestedClassID: number;
    course: Course;
    courseID: number;
    requestedClass: ClassModel;
    RegisterFormGroup: FormGroup;
    courseimageURL: string;
    description: string;
    errorMessage: string;
    currentUser: User;

    constructor(private formBuilder: FormBuilder, private courseService: CourseService,
        private activated_route: ActivatedRoute, private globals: Globals,
        private classService: ClassService,
    private userService: UserService ) {
    }

    ngOnInit() {

        this.requestedClassID = this.activated_route.snapshot.params['id'];
        this.requestedClass = this.activated_route.snapshot.data['requestedClass'];
        this.courseID = +this.requestedClass.course;
        this.currentUser = this.userService.currentUser;

        this.courseService.getCourse(this.courseID).subscribe(
            course =>  {this.course = course[0];
            this.courseimageURL = this.globals.courseimages + '/' + this.courseID + '/' + this.course.image;
             console.log('this.courseimageURL: ' + this.courseimageURL);
              this.description = this.course.description;
            },
                error => this.errorMessage = <any>error);

        this.RegisterFormGroup = this.formBuilder.group({
            firstname: [ '' , []],
            lastname: [ '' , []],
            email: [ '' , []],
            message: [ '' , []],
        });

    }

}

