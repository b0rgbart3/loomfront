import { Component, OnInit } from '@angular/core';
import { ClassModel } from '../../models/class.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from '../class.service';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CourseService } from '../../courses/course.service';
import { Course } from '../../models/course.model';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Enrollment } from '../../models/enrollment.model';
import { Student } from '../../models/student.model';
import { Instructor } from '../../models/instructor.model';

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
    instructorCount = 0;
    studentCount = 0;
    students: Student[];
    instructors: Instructor[];
    possibleInstructors: User[];
    possibleStudents: User[];
    courseSelections: Object[];
    showDialog = false;
    users: User[];
    instructorChoices: FormArray;
    studentChoices: FormArray;

    constructor( private activated_route: ActivatedRoute, private classService: ClassService,
        private router: Router, private courseService: CourseService,
        private userService: UserService, private fb: FormBuilder ) {   }

    get instructor_choices(): FormArray{
            return <FormArray> this.classForm.get('instructor_choices');
        }

    get student_choices(): FormArray{
        return <FormArray> this.classForm.get('student_choices');
    }

    ngOnInit(): void {

        const id = this.activated_route.snapshot.params['id'];
        this.thisClass = this.activated_route.snapshot.data['thisClass'][0];
        this.users = this.activated_route.snapshot.data['users'];
        this.courses = this.activated_route.snapshot.data['courses'];
        this.possibleInstructors = this.activated_route.snapshot.data['possibleInstructors'];
        // console.log('in init: poss.Instructors: ' + JSON.stringify(this.possibleInstructors));

        console.log('In Class Edit Component: thisClass = ' + JSON.stringify(this.thisClass));

        this.possibleStudents = this.activated_route.snapshot.data['users'];
        this.instructorChoices = <FormArray> this.fb.array([ ]);
        this.studentChoices = <FormArray> this.fb.array([ ]);

        this.classForm = this.fb.group({
            title: [ '', [Validators.required, Validators.minLength(3)] ] ,
            description: [ '', [Validators.required ]],
            course: '',
            start: [new Date()],
            end: [new Date()],
            instructor_choices: this.instructorChoices,
            student_choices: this.studentChoices
        });

        if (this.thisClass && this.thisClass.instructors) {
        this.instructors = this.thisClass.instructors; } else { this.instructors = null; }

        if (this.thisClass && this.thisClass.students) {this.students = this.thisClass.students; } else {
            this.students = null;
        }

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

        this.buildInstructorChoices();
        this.buildStudentChoices();
        this.populateForm();
    }

    buildInstructorChoice( user, isSelected ): FormGroup {
        return this.fb.group({value: isSelected, username: user.username, user_id: user.id });
    }
    buildStudentChoice( user, isSelected ): FormGroup {
        return this.fb.group({value: isSelected, username: user.username, user_id: user.id });
    }
    buildStudentChoices() {
        for (let i = 0; i < this.possibleStudents.length; i++) {
            let match = false;

            // The Instructors array contains the folks whose enrollments include this class
            // with the role of instructor.  We compare that against the full list of possible Instructors
            // in order to determine which Controls to check as selected.
            // If there's a match in the two lists, then we build the control with the value of true.
            if (this.students) {
            for (let j = 0; j < this.students.length; j++) {
                if (this.students[j].user_id === this.possibleStudents[i].id) {
                    match = true;
                }
            }}
            this.student_choices.push(this.buildStudentChoice(this.possibleStudents[i], match) );
        }
    }

    buildInstructorChoices() {
        for (let i = 0; i < this.possibleInstructors.length; i++) {
            let match = false;

            // The Instructors array contains the folks whose enrollments include this class
            // with the role of instructor.  We compare that against the full list of possible Instructors
            // in order to determine which Controls to check as selected.
            // If there's a match in the two lists, then we build the control with the value of true.
            if (this.instructors) {
            for (let j = 0; j < this.instructors.length; j++) {
                if (this.instructors[j].user_id === this.possibleInstructors[i].id) {
                    match = true;
                }
            } }
            this.instructor_choices.push(this.buildInstructorChoice(this.possibleInstructors[i], match) );
        }
    }

    populateForm() {

        if (this.thisClass) {
            console.log('In Class edit component - about to patch Values to the form: ' + JSON.stringify(this.thisClass));
        this.classForm.patchValue({'title': this.thisClass.title, 'description': this.thisClass.description,
            'course' : this.thisClass.course, 'start' : new Date(this.thisClass.start), 'end' : new Date(this.thisClass.end) });
        } else {
            console.log('ERROR in Class Edit -- no thisClass object!');
        }


    }

    // buildUserReference( regObj ): FormGroup {
    //     return this.fb.group( {
    //         userid: regObj.id,
    //         username: regObj.username
    //     });
    // }

    save(): void {
        // console.log('In Class-Edit component, about to savemodel: ' + JSON.stringify(this.classForm.value)  );
        if (this.classForm.dirty && this.classForm.valid) {

            // This is Deborah Korata's way of merging our data model with the form model
             const combinedClassObject = Object.assign( {}, this.thisClass, this.classForm.value);

            // we need to build the "instructors" array from the instructor_choices because
            // we only want to save the ones who are selected
            const tempInstructor_choices = combinedClassObject.instructor_choices;
            console.log('instructor_choices: ' + JSON.stringify(combinedClassObject.instructor_choices));

            const instructors = [];
            for (let i = 0; i < tempInstructor_choices.length; i++) {
                const saveableInstructor = tempInstructor_choices[i];

                if (saveableInstructor.value === true) {

                    instructors.push(saveableInstructor);
                }
            }
            combinedClassObject.instructors = instructors;
            delete combinedClassObject.instructor_choices;
            const tempStudent_choices = combinedClassObject.student_choices;

            const students = [];
            for (let i = 0; i < tempStudent_choices.length; i++) {
                const saveableStudent = tempStudent_choices[i];
                if (saveableStudent.value === true) {
                    students.push(saveableStudent);
                }
            }
            combinedClassObject.students = students;
            delete combinedClassObject.student_choices;
            console.log('in save: ' + JSON.stringify(combinedClassObject) );

            // This sends the newly formed class Object to the API
            const id_as_number = parseInt(this.thisClass.id, 10);
            if ( id_as_number > 0 ) {
                console.log('calling update: ');
                this.classService
                .updateClass( combinedClassObject ).subscribe(
                (val) => {
                 this.router.navigate(['/welcome']);
            }, response => { this.router.navigate(['/welcome']); },
                () => { });

            } else {
                console.log('calling createClass');
                this.classService.createClass( combinedClassObject ).subscribe(
                    (val) => { }, (response) => { console.log('save completed');
                     this.router.navigate(['/welcome']); }
                    ,
                      () => {});
            }

        }
    }



    onSaveComplete(): void {

        this.classForm.reset();
        this.router.navigate(['/admin']);
    }
}

