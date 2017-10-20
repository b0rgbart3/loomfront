import { Component, OnInit } from '@angular/core';
import { ClassModel } from '../../models/class.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from '../class.service';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CourseService } from '../../courses/course.service';
import { Course } from '../../models/course.model';
import { UserService } from '../../users/user.service';
import { User } from '../../models/user.model';
import { Enrollment } from '../../models/enrollment.model';

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
    students: User[];
    instructors: User[];
    possibleInstructors: User[];
    showDialog = false;
    users: User[];
    courseSelections = [
        // {value: '1', viewValue: 'Course 1'},
        // {value: '2', viewValue: 'Course 2'},
    ];
    instructorChoices: FormArray;

    constructor( private activated_route: ActivatedRoute, private classService: ClassService,
        private router: Router, private courseService: CourseService,
        private userService: UserService, private fb: FormBuilder ) {   }

    get instructor_choices(): FormArray{
            return <FormArray> this.classForm.get('instructor_choices');
        }

    ngOnInit(): void {

        const id = this.activated_route.snapshot.params['id'];
        this.thisClass = this.activated_route.snapshot.data['thisClass'][0];
        this.users = this.activated_route.snapshot.data['users'];
        this.possibleInstructors = this.activated_route.snapshot.data['possibleInstructors'];
        console.log('Possible Instructors: ' + this.possibleInstructors.length );

        console.log('class edit oninit: ' + JSON.stringify(this.thisClass));
        this.instructorChoices = <FormArray> this.fb.array([ ]);


        this.classForm = this.fb.group({
            title: [ '', [Validators.required, Validators.minLength(3)] ] ,
            description: [ '', [Validators.required ]],
            course: '',
            start: [new Date()],
            end: [new Date()],
            instructor_choices: this.instructorChoices
        });

        this.populateForm();
        this.userService.getInstructors(id).subscribe(
            (instructors) => {this.instructors = instructors;
                this.buildInstructorChoices();
            this.instructorCount = instructors.length;
            // console.log('Found Instructors: ' + JSON.stringify(this.instructors));
            this.userService.getStudents(id).subscribe(
                (students) => { this.students = students;
                this.studentCount = students.length;
            // console.log('Found Students: ' + JSON.stringify(this.students));
        },
            (err) => this.errorMessage = <any> err );
        },
            (err) => this.errorMessage = <any> err
        );

        this.courseService
        .getCourses().subscribe(
          courses => { this.courses = courses;
            // console.log ('Got the courses');
            for (let i = 0; i < this.courses.length; i++) {
                // console.log(this.courses[i].title);
                const newObject = { value: this.courses[i].id , viewValue: this.courses[i].title };
                // console.log(newObject);
                this.courseSelections.push( newObject );
            }

        },
          error => this.errorMessage = <any>error);


    }

    buildInstructorChoice( user, isSelected ): FormGroup {
        return this.fb.group({value: isSelected, username: user.username, id: user.id });
    }

    buildInstructorChoices() {
        for (let i = 0; i < this.possibleInstructors.length; i++) {
            let match = false;

            // The Instructors array contains the folks whose enrollments include this class
            // with the role of instructor.  We compare that against the full list of possible Instructors
            // in order to determine which Controls to check as selected.
            // If there's a match in the two lists, then we build the control with the value of true.

            for (let j = 0; j < this.instructors.length; j++) {
                if (this.instructors[j].id === this.possibleInstructors[i].id) {
                    match = true;
                }
            }
            this.instructor_choices.push(this.buildInstructorChoice(this.possibleInstructors[i], match) );
        }
    }

    populateForm() {

        this.classForm.patchValue({'title': this.thisClass.title, 'description': this.thisClass.description,
            'course' : this.thisClass.course, 'start' : new Date(this.thisClass.start), 'end' : new Date(this.thisClass.end) });



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


            // we store the instructor choices separately from the class info (even though we make both editable here).
             delete combinedClassObject.instructor_choices;

            // This sends the class Object to the API
            if (this.thisClass.id === '0') {
                this.classService.createClass( combinedClassObject ).subscribe(
                    (val) => { }, response => console.log('')
                    ,
                      () => {});
            } else { this.classService
                .updateClass( combinedClassObject ).subscribe(
                (val) => {}, response => {},
                () => { }); }


        }
    }



    onSaveComplete(): void {

        this.classForm.reset();
        this.router.navigate(['/admin']);
    }
}

