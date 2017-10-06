import { Component, OnInit } from '@angular/core';
import { ClassModel } from '../../models/class.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from '../class.service';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CourseService } from '../../courses/course.service';
import { Course } from '../../models/course.model';
import { UserService } from '../../users/user.service';
import { User } from '../../models/user.model';


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
    userChart: Object[];

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

        this.classForm = this.fb.group({
            title: [ '', [Validators.required, Validators.minLength(3)] ] ,
            description: [ '', [Validators.required ]],
            course: '',
            start: [new Date()],
            end: [new Date()],
            regUsers: this.regUsers,
        });


        this.thisClass = new ClassModel( '', '', '', '', '', '0', [] );
        const id = +this.activated_route.snapshot.params['id'];

        console.log('This ID: ' + id);

        if (id !== 0) {
            this.getClass(id);
         }

         this.classService
         .getClasses().subscribe(
           classes => { this.classes = classes; } );

        this.courseService
        .getCourses().subscribe(
          courses => { this.courses = courses;

            for (let i = 0; i < this.courses.length; i++) {
                // console.log(this.courses[i].title);
                const newObject = { value: this.courses[i].id , viewValue: this.courses[i].title };
                console.log(newObject);
                this.courseSelections.push( newObject );
            }
            // console.log(JSON.stringify( this.courseSelections) );
            this.userService
            .getUsers().subscribe(
              users => { this.users = users;
                this.populateForm();

            },
              error => this.errorMessage = <any>error);
        },
          error => this.errorMessage = <any>error);


    }

    getClass(id: number) {
        this.classService.getClass(id).subscribe(
            classobject => {this.thisClass = <ClassModel>classobject[0]; },
            error => this.errorMessage = <any> error
        );
    }

    populateForm() {
        console.log('In pop form, ' + JSON.stringify(this.thisClass));
        this.classForm.patchValue({'title': this.thisClass.title, 'description': this.thisClass.description,
            'course' : this.thisClass.course, 'start' : new Date(this.thisClass.start), 'end' : new Date(this.thisClass.end) });

            const regUserArray = this.thisClass.regUsers;

            console.log('regUserArray: ' + regUserArray);

            this.userChart = [];

            for (let i = 0; i < this.users.length; i++) {
                const chartObject = {'id': '0', 'value': false, 'name': ''};
                const thisUser = <User> this.users[i];
                chartObject.id = thisUser.id;
                chartObject.name = thisUser.username;

                if (this.thisClass.regUsers.includes(chartObject.id)) {
                    chartObject.value = true;
                }

                this.userChart.push(chartObject);
                this.regUsers.push( this.fb.group( {
                    userid: chartObject.id,
                    username: chartObject.name,
                    value: chartObject.value
                }) );


            }

            console.log(this.userChart);

            // for (let i = 0; i < thisClass.regUsers.length; i++) {

            //     const regUser = <Materialreference> thissectionMaterials[j];

            //     const refID = materialReference.reference;


            //     sectionMaterialReferences.push ( this.fb.group( {
            //         reference: refID,
            //     }));
    }

    buildUserReference(): FormGroup {
        return this.fb.group( {
            userid: ''
        });
    }

    save(): void {
        console.log('In Class-Edit component, about to savemodel: ' + JSON.stringify(this.classForm.value)  );
        if (this.classForm.dirty && this.classForm.valid) {

            // This is Deborah Korata's way of merging our data model with the form model
             const combinedClassObject = Object.assign( {}, this.thisClass, this.classForm.value);

             // I need to process the RegUsers values -- because rather than storing an object for each
             // and every user - I just want to store an array of user ids that are registered
             // so I'm going to remove the RegUsers FormArray -- and add a new array with just
             // the userid's

            const storableUserIds = [];

             for (let i = 0; i < this.users.length; i++ ) {
                 const thisControl = this.regUsers.at(i);

                 if (thisControl.value.value === true) {
                    storableUserIds.push(thisControl.value.userid);
                  }
             }
             delete combinedClassObject.regUsers;

             const newRegUserObject = { 'regUsers': storableUserIds };

             const comboObject = Object.assign( {}, combinedClassObject, newRegUserObject );

            // This sends the class Object to the API
            if (this.thisClass.id === '0') {
                this.classService.createClass( comboObject ).subscribe(
                    (val) => { }, response => { console.log(response); },
                      () => { this.router.navigate(['/admin']); } );
            } else { this.classService
                .updateClass( comboObject ).subscribe(
                (val) => {}, response => {},
                () => { this.router.navigate(['/admin']); }); }

        }
    }



    onSaveComplete(): void {
        this.classForm.reset();
        this.router.navigate(['/admin']);
    }
}

