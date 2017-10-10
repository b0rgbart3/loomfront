import { Component, OnInit } from '@angular/core';
import { ClassModel } from '../../models/class.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from '../class.service';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CourseService } from '../../courses/course.service';
import { Course } from '../../models/course.model';
import { UserService } from '../../users/user.service';
import { User } from '../../models/user.model';
import { Classregistrationgroup } from '../../models/classregistrationgroup.model';
import { Classregistration } from '../../models/classregistration.model';


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
    regUsers: FormArray;
    instructingUsers: FormArray;
    userChart: Object[];
    registry: Classregistrationgroup;
    regs: Classregistration[];
    instructors: Classregistration[];
    sortedRegs: Classregistrationgroup;


    users = [
    ];
     courseSelections = [
        // {value: '1', viewValue: 'Course 1'},
        // {value: '2', viewValue: 'Course 2'},
    ];

    constructor( private activated_route: ActivatedRoute, private classService: ClassService,
        private router: Router, private courseService: CourseService,
        private userService: UserService, private fb: FormBuilder ) {   }

    ngOnInit(): void {

        this.regUsers = this.fb.array([  ]);
        this.instructingUsers = this.fb.array([  ]);

        this.classForm = this.fb.group({
            title: [ '', [Validators.required, Validators.minLength(3)] ] ,
            description: [ '', [Validators.required ]],
            course: '',
            start: [new Date()],
            end: [new Date()],
            instructors: this.instructingUsers,
            regUsers: this.regUsers,
        });

        this.thisClass = new ClassModel( '', '', '', '', '', '0' );
        const id = +this.activated_route.snapshot.params['id'];

        // console.log('This ID: ' + id);

        if (id !== 0) { this.getClass(id); }

         this.classService
         .getClasses().subscribe(
           classes => { this.classes = classes; } );

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
            // console.log(JSON.stringify( this.courseSelections) );
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
                        this.populateForm();

            },
                error => this.errorMessage = <any>error);

            },
              error => this.errorMessage = <any>error);
        },
          error => this.errorMessage = <any>error);


    }

    getClass(id: number) {
        this.classService.getClass(id).subscribe(
            classobject => {this.thisClass = <ClassModel>classobject[0];
            // console.log('Got the Class Info: ' + JSON.stringify(this.thisClass));
         },
            error => this.errorMessage = <any> error
        );
    }

    continuePopulatingForm() {
        // OK here I'm going to build my RegUsers array.
        // loop through the reg array to build a simple regUsersArray (collection of user ids)

        this.userChart = [];
 

        // Here I am building a custom CHART - (array of coloquial objects ) - just for the purposes of display
        // The FORM ARRAY - is built of these temporary user objects - which I am building based on the
        // regs array within the ClasRegistration object that we loaded in.
        // console.log('REGS:' + JSON.stringify( this.regs) );

        for (let i = 0; i < this.users.length; i++) {
            const chartObject = {'id': '0', 'value': false, 'name': '', 'creation_date': '', 'roles' : [], 'status': []};
            const thisUser = <User> this.users[i];
            chartObject.id = thisUser.id;
            chartObject.name = thisUser.username;
            chartObject.value = false;

            this.userChart.push(chartObject);

            if (thisUser.user_type.includes('instructor')) {

                for (let m = 0; m < this.instructors.length; m++) {
                    if (thisUser.id === this.instructors[m].userid) {
                        chartObject.value = true;
                    }
                }

                this.instructingUsers.push( this.fb.group( {
                    userid: chartObject.id,
                    username: chartObject.name,
                    value: chartObject.value,
                    creation_date: chartObject.creation_date,
                    status: []
                }) ); }


            chartObject.value = false; // start over for Student List 
            // loop through the regs to adjust the values of the reg Form array
            // console.log ('Regs: ' + this.regs.length );

            for (let j = 0; j < this.regs.length; j++ ) {

                // console.log(thisUser.id + ', ' + this.regs[j].userid);
                if (thisUser.id === this.regs[j].userid) {
                    chartObject.value = true;
                }

            }

            this.regUsers.push( this.fb.group( {
                userid: chartObject.id,
                username: chartObject.name,
                value: chartObject.value,
                creation_date: chartObject.creation_date,
                status: chartObject.status
            }) );

        }
       //  console.log(this.userChart);
    }
    populateForm() {

        // console.log('In Pop Form: ' + JSON.stringify ( this.regs ));
        // we need to have the full list of users in memory so that we can build our list of reg. students
        if (!this.users) { return; }

        // console.log('In pop form, ' + JSON.stringify(this.thisClass));
        this.classForm.patchValue({'title': this.thisClass.title, 'description': this.thisClass.description,
            'course' : this.thisClass.course, 'start' : new Date(this.thisClass.start), 'end' : new Date(this.thisClass.end) });

        this.continuePopulatingForm();

    }

    buildUserReference( regObj ): FormGroup {
        return this.fb.group( {
            userid: regObj.id,
            username: regObj.username
        });
    }

    sortRegs() {


            const newClassRegistrationObject = {'id': this.thisClass.id, 'instructors': [], 'regs': [] };

            const instructorList = [];
            const studentList = [];


            for (let i = 0; i < this.instructingUsers.length; i++) {

                if (this.instructingUsers.at(i).value.value) {

                      instructorList.push(this.instructingUsers.at(i).value);
                }
            }

            // Looping through the FormArray
            for (let j = 0; j < this.regUsers.length; j++ ) {


                if (this.regUsers.at(j).value.value) {
                    studentList.push(this.regUsers.at(j).value);
                }

            }

            // look for duplicates and consolidate them

            console.log(JSON.stringify( studentList ) );


            console.log( 'New TempList: ' + JSON.stringify( studentList ) );
            newClassRegistrationObject.instructors = instructorList;
            newClassRegistrationObject.regs = studentList;
             // }

            // for (let j = 0; j < this.regUsers.length; j++) {
            //     console.log ('j = ' + j + ', ' +  this.regUsers[j].value);

            // if (this.regUsers[j].value === false ) {
            //     this.regs.splice( j , 1);
            // }
       //  }

        this.sortedRegs = newClassRegistrationObject;

    }
    save(): void {
        // console.log('In Class-Edit component, about to savemodel: ' + JSON.stringify(this.classForm.value)  );
        if (this.classForm.dirty && this.classForm.valid) {

            // This is Deborah Korata's way of merging our data model with the form model
             const combinedClassObject = Object.assign( {}, this.thisClass, this.classForm.value);


            // we store the class registrations separately from the class info (even though we make both editable here).
             delete combinedClassObject.regUsers;

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

            this.sortRegs();
            this.classService.saveRegistry( this.sortedRegs ).subscribe (
                    (val) => { }, response => { } , () => { this.onSaveComplete(); } );
        }
    }



    onSaveComplete(): void {


        this.classForm.reset();
        this.router.navigate(['/admin']);
    }
}

