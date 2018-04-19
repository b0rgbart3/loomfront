import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { NgForm, FormControl, FormBuilder,
  FormGroup, FormArray, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Globals } from '../../globals2';
import { UserService } from '../../services/user.service';
import { ClassService } from '../../services/class.service';
import { ClassModel } from '../../models/class.model';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { Enrollment } from '../../models/enrollment.model';
import { EnrollmentsService } from '../../services/enrollments.service';

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
    enrollments: Enrollment[];
    classesTakingIDList: any[];
    alreadyRegistered: boolean;

    constructor(private formBuilder: FormBuilder, private courseService: CourseService,
        private activated_route: ActivatedRoute, private globals: Globals,
        private classService: ClassService,
    private userService: UserService,
    private router: Router,
private enrollmentService: EnrollmentsService ) {
    }

    ngOnInit() {

        this.alreadyRegistered = false;
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
            // firstname: [ '' , []],
            // lastname: [ '' , []],
            // email: [ '' , []],
            // message: [ '' , []],
            // I used to ask for this info -- but now we just grab the info from a logged in user.
        });

        // Get the student enrollment objects for the current user
        this.enrollments = this.activated_route.snapshot.data['enrollments'];

        // extract out just the ID's into an array
        if (this.enrollments) {
        this.classesTakingIDList = this.enrollments.map( enrollment => enrollment.class_id); }

        if ( this.classesTakingIDList.indexOf(this.requestedClassID) !== -1) {
            // apparently this user has already registered for this class
            this.alreadyRegistered = true;
        }

    }

    gotoClassPage() {
        const routeString = 'classes/' + this.requestedClassID + '/0';
        this.router.navigate([routeString]);
    }
    registerSubmit() {
        // OK!  I'm going to go for it and let user's register themselves.
        // In other words - this Registration Form will automatically enter a student Enrollment into the DB

        const newEnrollment = new Enrollment( '', this.currentUser.id, '' + this.requestedClassID, [], null, null );

        this.enrollmentService.postEnrollment(newEnrollment).subscribe(

            (val) => {
                console.log('POST call successful value returned in body ', val);
              },
              response => {
                console.log('POST call in error', response);
              },
              () => {
                console.log('The POST observable is now completed.');
                // this.userService.currentUser = settingsObject;
                // Now that we are done saving the changes - we can reset the form so that the Guard doesn't think it's still fresh
                this.RegisterFormGroup.reset();
                this.router.navigate(['/']);
              }
        );


    }

}

