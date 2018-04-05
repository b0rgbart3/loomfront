import { Component, OnInit } from '@angular/core';
import { ClassModel } from '../../models/class.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from '../../services/class.service';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Enrollment } from '../../models/enrollment.model';
import _ from 'lodash';
import {Location} from '@angular/common';


@Component({
    moduleId: module.id,
    templateUrl: 'class-edit.component.html',
    styleUrls: ['class-edit.component.css']
})

export class ClassEditComponent implements OnInit {
    classForm: FormGroup;
    thisClass: ClassModel;
    classes: ClassModel[];
    id: string;
    errorMessage: string;
    courses: Course[];
    courseSelections: Object[];
    showDialog = false;

    instructorChoices: FormArray;


    constructor( private activated_route: ActivatedRoute, private classService: ClassService,
        private router: Router, private courseService: CourseService,
        private userService: UserService, private fb: FormBuilder,
        private _location: Location  ) {   }



    ngOnInit(): void {

        const id = this.activated_route.snapshot.params['id'];

        console.log('The ID for this new class is: ' + id);

        this.thisClass = this.activated_route.snapshot.data['thisClass'];
        this.courses = this.activated_route.snapshot.data['courses'];

        console.log('In Class Edit Component: thisClass = ' + JSON.stringify(this.thisClass));

        this.classForm = this.fb.group({
            title: [ '' , []],
            course: ['', []],
            start: [new Date(), []],
            end: [new Date(), []],
            cost: [''],
            costBlurb: ['', []]
        });

        this.courseSelections = [];

        if (this.courses) {
            for (let i = 0; i < this.courses.length; i++) {
                console.log(this.courses[i].title);
                const newObject = { value: this.courses[i].id , viewValue: this.courses[i].title };
                console.log(newObject);
                this.courseSelections.push( newObject );
            }

            console.log('course selections: ' + JSON.stringify(this.courseSelections) );
        }

       // this.buildInstructorChoices();
       // this.buildStudentChoices();
        this.populateForm();
    }

    // buildInstructorChoice( user, isSelected ): FormGroup {
    //     return this.fb.group({value: isSelected, username: user.username, user_id: <string> user.id });
    // }
    // buildStudentChoice( user, isSelected ): FormGroup {
    //     return this.fb.group({value: isSelected, username: user.username, user_id: <string> user.id });
    // }
    // buildStudentChoices() {
    //     for (let i = 0; i < this.possibleStudents.length; i++) {
    //         let match = false;

    //         // The Instructors array contains the folks whose enrollments include this class
    //         // with the role of instructor.  We compare that against the full list of possible Instructors
    //         // in order to determine which Controls to check as selected.
    //         // If there's a match in the two lists, then we build the control with the value of true.
    //         if (this.students) {
    //         for (let j = 0; j < this.students.length; j++) {
    //             if (this.students[j].id === this.possibleStudents[i]) {
    //                 match = true;
    //             }
    //         }}
    //         this.student_choices.push(this.buildStudentChoice(this.possibleStudents[i], match) );
    //     }
    // }

    // buildInstructorChoices() {
    //     for (let i = 0; i < this.possibleInstructors.length; i++) {
    //         let match = false;

    //         // The Instructors array contains the folks whose enrollments include this class
    //         // with the role of instructor.  We compare that against the full list of possible Instructors
    //         // in order to determine which Controls to check as selected.
    //         // If there's a match in the two lists, then we build the control with the value of true.
    //         if (this.instructors) {
    //         for (let j = 0; j < this.instructors.length; j++) {
    //             if (this.instructors[j].user_id === this.possibleInstructors[i].id) {
    //                 match = true;
    //             }
    //         } }
    //         this.instructor_choices.push(this.buildInstructorChoice(this.possibleInstructors[i], match) );
    //     }
    // }

    populateForm() {

        if (this.thisClass) {
            console.log('In Class edit component - about to patch Values to the form: ' + JSON.stringify(this.thisClass));
            this.classForm.patchValue({'title': this.thisClass.title,
            'course' : this.thisClass.course, 'start' : new Date(this.thisClass.start), 'end' : new Date(this.thisClass.end),
            'cost' : this.thisClass.cost, 'costBlurb': this.thisClass.costBlurb });
        } else {
            console.log('ERROR in Class Edit -- no thisClass object!');
        }
    }

    save(): void {
        console.log('In Class-Edit component, about to savemodel: ' + JSON.stringify(this.classForm.value)  );
        if (this.classForm.dirty) {

            console.log('Form was dirty');

            // This is Deborah Korata's way of merging our data model with the form model
             const combinedClassObject = Object.assign( {}, this.thisClass, this.classForm.value);

            // we need to build the "instructors" array from the instructor_choices because
            // we only want to save the ones who are selected
         //   const tempInstructor_choices = combinedClassObject.instructor_choices;


            // This sends the newly formed class Object to the API
            let id_as_number = 0;
            if (this.thisClass.id) {
             id_as_number = parseInt(this.thisClass.id, 10);
            } else {
                this.thisClass.id = '0';
            }

            if ( id_as_number > 0 ) {
                console.log('calling update: ');
                this.classService
                .updateClass( combinedClassObject ).subscribe(
                (val) => {
                 this.router.navigate(['/admin/classes']);
            }, response => { this.router.navigate(['/admin/classes']); },
                () => { });

            } else {
                console.log('calling createClass');
                this.classService.createClass( combinedClassObject ).subscribe(
                    (val) => { }, (response) => { console.log('continued response');  },
                      () => {console.log('save completed');
                      this.router.navigate(['/admin/classes']); });
            }

        }
    }
    closer() {
        this._location.back();
    }

    remove() {
        // wondering if I should combine the form object with the data model here before marking it to be removed....
        this.classService.removeClass( this.thisClass).subscribe( (val) => {
            this.router.navigate(['/admin/classes']);
        }, response => { this.router.navigate(['/admin/classes']); },
            () => { });

    }


    onSaveComplete(): void {

        this.classForm.reset();
        this.router.navigate(['/admin']);
    }
}

