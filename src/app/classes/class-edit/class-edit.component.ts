import { Component, OnInit } from '@angular/core';
import { ClassModel } from '../../models/class.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from '../class.service';
import { FormGroup, FormControl } from '@angular/forms';
import { CourseService } from '../../courses/course.service';
import { Course } from '../../models/course.model';
import { UserService } from '../../users/user.service';


@Component({
    moduleId: module.id,
    templateUrl: 'class-edit.component.html',
    styleUrls: ['class-edit.component.css']
})

export class ClassEditComponent implements OnInit {
    classForm: FormGroup;
    thisClass: ClassModel;
    id: string;
    errorMessage: string;
    courses: Course[];
    myStart: Date;
    myEnd: Date;

    users = [
        { "username":"Terry" },
        { "username":"John"}
    ];
     courseSelections = [
        // {value: '1', viewValue: 'Course 1'},
        // {value: '2', viewValue: 'Course 2'},
    ];

    constructor( private activated_route: ActivatedRoute, private classService: ClassService,
        private router: Router, private courseService: CourseService,
        private userService: UserService ) {   }



    ngOnInit(): void {
        this.thisClass = new ClassModel( '', '', '', '', '', '0' );
        const id = +this.activated_route.snapshot.params['id'];

        if (id !== 0) {
            this.getClass(id);
         }

        this.courseService
        .getCourses().subscribe(
          courses => { this.courses = courses;

            for (let i = 0; i < this.courses.length; i++) {
                // console.log(this.courses[i].title);
                const newObject = { value: i.toString(), viewValue: this.courses[i].title };
                console.log(newObject);
                this.courseSelections.push( newObject );
            }
            // console.log(JSON.stringify( this.courseSelections) );
        },
          error => this.errorMessage = <any>error);


          this.userService
          .getUsers().subscribe(
            users => { this.users = users;

          },
            error => this.errorMessage = <any>error);

    }

    getClass(id: number) {
        this.classService.getClass(id).subscribe(
            classobject => {this.thisClass = <ClassModel>classobject[0]; },
            error => this.errorMessage = <any> error
        );
    }



    save(form): void {
        // console.log('In Class-Edit component, about to savemodel: ' + JSON.stringify(form.value)  );
        if (form.dirty && form.valid) {

            // This is Deborah Korata's way of merging our data model with the form model
             const combinedClassObject = Object.assign( {}, this.thisClass, form.value);
          //  console.log('In Class-Edit component, saving model');
            if (this.thisClass.id === '0') {
                this.classService.createClass( combinedClassObject ).subscribe(
                // this.classService.createClass( combinedClassObject ).subscribe(
                    (val) => {
                    //    console.log('POST call successful value returned in body ', val);
                      },
                      response => {
                    //    console.log('POST call in error', response);
                      },
                      () => {
                      //  console.log('The POST observable is now completed.');
                      //   this.alertService.success('Thank you for registering with the Reclaiming Loom. ' +
                      //   ' Now, please check your email, and use the verification code to verify your account.  Thank you.', true);
                      //   // this._flashMessagesService.show('Username or password was incorrect.',
                        // { cssClass: 'alert-warning', timeout: 7000 });
                        this.router.navigate(['/admin']);
                      }
                );
            } else {
                // Validate stuff here
       
                this.classService
                .updateClass( combinedClassObject ).subscribe(
                (val) => {
               // console.log('POST call successful value returned in body ', val);
                },
                response => {
              //  console.log('POST call in error', response);
                },
                () => {
        
                this.router.navigate(['/admin']);
                });
            }
        }
    }



    onSaveComplete(): void {
        this.classForm.reset();
        this.router.navigate(['/admin']);
    }
}

