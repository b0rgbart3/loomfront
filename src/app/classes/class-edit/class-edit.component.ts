import { Component, OnInit } from '@angular/core';
import { ClassModel } from '../../models/class.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from '../class.service';
import { FormGroup, FormControl } from '@angular/forms';
import { CourseService } from '../../courses/course.service';
import { Course } from '../../models/course.model';


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
    // weeks= ['1 Week', '2 Weeks', '3 Weeks', '4 Weeks', '5 Weeks', '6 Weeks',
    // '7 Weeks', '8 Weeks', '9 Weeks', '10 Weeks', '11 Weeks', '12 Weeks'];


    // foods = [
    //     {value: '1', viewValue: '1 Week'},
    //     {value: '2', viewValue: '2 Week'},
    //     {value: '3', viewValue: '3 Week'},
    //     {value: '4', viewValue: '4 Week'},
    //     {value: '5', viewValue: '5 Week'},
    //     {value: '6', viewValue: '6 Week'},
    //     {value: '7', viewValue: '7 Week'},
    //   ];

     courseSelections = [
        // {value: '1', viewValue: 'Course 1'},
        // {value: '2', viewValue: 'Course 2'},
    ];

    constructor( private activated_route: ActivatedRoute, private classService: ClassService,
        private router: Router, private courseService: CourseService ) {   }

    // buildCourseSelect(course) {
    //     const newObject = { value: this.courseSelections.length, viewValue: course.title };
    //     return newObject;
    // }

    ngOnInit(): void {
        this.thisClass = new ClassModel( '', '', '', '', '', '0' );
        const id = +this.activated_route.snapshot.params['id'];

        if (id !== 0) {
           // console.log('In the edit component, id was not zero: ' + id);

            this.getClass(id);
         }

        // this.classForm = this.fb.group({
        //     title: this.thisClass.title,
        //     description: this.thisClass.description,
        //     course: { type: 'select', label: 'coursework', name: 'course', options: [this.courses],
        //                 placeholder: 'select a course', value: this.thisClass.course },
        //     start: [ new Date( this.thisClass.start ), Validators.required ],
        //     end: [ new Date( this.thisClass.end), Validators.required ]
        // });

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

        // this.classForm.controls['course'].valueChanges.subscribe((value) => {
        //     console.log('value changed: ' + this.classForm.get('course').value);
        //     // if (course) { console.log('Selected Course: ' + course.title); }
        // });
        // this.classForm.controls['length'].valueChanges.subscribe((value) => {
        //     console.log(value);

        //   });
        // this.classForm.patchValue({
        //     // start: this.thisClass.start
        //   });

        //  this.classForm = new FormGroup( {
        //     title: new FormControl(),
        //     description: new FormControl(),
        //     // I don't actually think I need a form control for the course id
        //    // course_id: new FormControl(this.thisCla)
        //  } );

    }

    getClass(id: number) {
        this.classService.getClass(id).subscribe(
            classobject => {this.thisClass = <ClassModel>classobject[0];
                console.log('got class info :' +
                            JSON.stringify(classobject) );
                            this.myStart = new Date (this.thisClass.start);
                            this.myEnd = new Date (this.thisClass.end);

                           // console.log('Getting the class Object: ' + JSON.stringify( this.thisClass ) );
                           // this.populateForm();
                         },
            error => this.errorMessage = <any> error
        );
    }


    // populateForm(): void {
    //    // console.log('In populate: ' + JSON.stringify(this.thisClass) );
    //     this.classForm.patchValue({
    //         title: this.thisClass.title,
    //         description: this.thisClass.description,
    //         course: { type: 'select', label: 'coursework', name: 'course', options: [this.courses],
    //                     placeholder: 'select a course', value: this.thisClass.course },
    //         start: new Date(this.thisClass.start),
    //         end: new Date(this.thisClass.end)
    //     });
    // }

    save(form): void {
        console.log('In Class-Edit component, about to savemodel: ' + JSON.stringify(form.value)  );
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
               console.log('About to update class.');
               console.log(combinedClassObject);
                this.classService
                .updateClass( combinedClassObject ).subscribe(
                (val) => {
               // console.log('POST call successful value returned in body ', val);
                },
                response => {
              //  console.log('POST call in error', response);
                },
                () => {
              //  console.log('The POST observable is now completed.');
                //   this.alertService.success('Thank you for registering with the Reclaiming Loom. ' +
                //   ' Now, please check your email, and use the verification code to verify your account.  Thank you.', true);
                //   // this._flashMessagesService.show('Username or password was incorrect.',
                // { cssClass: 'alert-warning', timeout: 7000 });
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

