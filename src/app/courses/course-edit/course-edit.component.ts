import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../course.service';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Section } from '../../models/section.model';

@Component({
    moduleId: module.id,
    templateUrl: 'course-edit.component.html',
    styleUrls: ['course-edit.component.css']
})

export class CourseEditComponent implements OnInit {

    // This is the Form Model -- and the Root Form Group Object
    courseForm: FormGroup;

    // This is the Data Model
    course: Course = new Course( '', '', '0', [] );
    id: string;
    errorMessage: string;
    formSections: FormArray;

    // sections: Object[];

    get sections(): FormArray {
        return <FormArray>this.courseForm.get('sections');
    }

    constructor(private router: Router, private activated_route: ActivatedRoute,
        private courseService: CourseService, private fb: FormBuilder ) { }

    ngOnInit(): void {
        // Instantiating the Root Form Group Object
        // This service takes in a form configuration object

            // this.buildSection()
   
        this.formSections = this.fb.array([  ]);
        this.courseForm = this.fb.group({
            title: [ '', [Validators.required, Validators.minLength(3)] ] ,
            description: [ '', [Validators.required ]],
            sections: this.formSections
        });

        // this.courseForm = new FormGroup({
        //     title: new FormControl(''),
        //     description: new FormControl()
        // });
        // this.sections = [];
        // this.sections.push( new Section( 'Section Title', '0', 'Section Content goes here...'));

        const id = +this.activated_route.snapshot.params['id'];
        console.log('MyID: ' + id);

        if (id !== 0) {
            this.getCourse(id);
         }
    }

    populateForm(): void {
        this.courseForm.patchValue({'title': this.course.title, 'description': this.course.description });

        if (this.course.sections) {
            for (let i = 0; i < this.course.sections.length; i++) {
                // this.addSection();
                this.sections.push(this.fb.group( this.course.sections[i]) );
            }
        }
    }

    getCourse(id: number) {
        this.courseService.getCourse(id).subscribe(
            course => {this.course = <Course>course[0];
                console.log('got course info :' + JSON.stringify(course) );
                this.populateForm();
             },
            error => this.errorMessage = <any> error
        );
    }

    postCourse() {

         // This is Deborah Korata's way of merging our data model with the form model
        const combinedCourceObject = Object.assign( {}, this.course, this.courseForm.value);
        console.log( 'Posting course: ' + JSON.stringify(combinedCourceObject) );

        if (this.course.id === '0') {
            this.courseService.createCourse( combinedCourceObject ).subscribe(
                (val) => {
                    console.log('POST call successful value returned in body ', val);
                  },
                  response => {
                    console.log('POST call in error', response);
                  },
                  () => {
                    console.log('The POST observable is now completed.');
                  //   this.alertService.success('Thank you for registering with the Reclaiming Loom. ' +
                  //   ' Now, please check your email, and use the verification code to verify your account.  Thank you.', true);
                  //   // this._flashMessagesService.show('Username or password was incorrect.',
                    // { cssClass: 'alert-warning', timeout: 7000 });
                    this.router.navigate(['/admin']);
                  }
            );
        } else {
            // Validate stuff here
            this.courseService
            .updateCourse( combinedCourceObject ).subscribe(
            (val) => {
            console.log('POST call successful value returned in body ', val);
            },
            response => {
            console.log('POST call in error', response);
            },
            () => {
            console.log('The POST observable is now completed.');
            //   this.alertService.success('Thank you for registering with the Reclaiming Loom. ' +
            //   ' Now, please check your email, and use the verification code to verify your account.  Thank you.', true);
            //   // this._flashMessagesService.show('Username or password was incorrect.',
            // { cssClass: 'alert-warning', timeout: 7000 });
            this.router.navigate(['/admin']);
            }
        );
        }
    }

    addSection(): void {
      //  this.sections.push( new Section( 'Section Title', '0', 'Section Content goes here...'));
      this.sections.push(this.buildSection());
    }

    buildSection(): FormGroup {
        return this.fb.group( {
            sectionTitle: '',
            sectionContent: ''
        });
    }

    killSection(i) {
        console.log('Kill' + i);
        this.sections.removeAt(i);
        // this.courseForm.get('sections').splice(i, 1);
        // Here I need to remove the section with an index of i from the sections array.
    }
}
