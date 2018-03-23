import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Globals } from '../../globals';
import { Enrollment } from '../../models/enrollment.model';
import { ClassModel } from '../../models/class.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ClassService } from '../../services/class.service';
import { EnrollmentsService } from '../../services/enrollments.service';


@Component({
    moduleId: module.id,
    templateUrl: 'enrollment-instructor-tab.component.html',
    styleUrls: ['enrollment-edit.component.css']
})

export class EnrollmentInstructorTabComponent implements OnInit {
    enrollmentForm: FormGroup;
    enrollments: Enrollment[];
    classes: ClassModel[];
    users: User[];
  feedback: string;



    constructor(private router: Router, private activated_route: ActivatedRoute, private fb: FormBuilder,
        private globals: Globals, private userService: UserService, private enrollmentsService: EnrollmentsService,
    private classService: ClassService ) { }

        // The form control names match the Enrollment Data Model.  Nice!

    ngOnInit() {

        this.activated_route.data.subscribe(
            data => {
            console.log('Got new data!');
            this.enrollments = data['enrollments'];
            console.log(' Enrollments: ' + JSON.stringify(data));
            this.classes = data['classes'];
            this.users = data['users'];
           // this.assignUserObjects();
            }
        );

        this.enrollmentForm = this.fb.group({
            user_id: [ '', Validators.required ],
            class_id: [ '', Validators.required ],
            });

    }


    unique( object ) {
        // We don't want to have a duplicate in the DB
                let unique = true;
                for (let i = 0; i < this.enrollments.length; i++) {
                    if (object.user_id === this.enrollments[i].user_id) {
                        if ( object.class_id === this.enrollments[i].class_id) {

                                unique = false;


                        }
                    }
                }
                return unique;
            }

            trash(index) {
                console.log('about to delete: ' + JSON.stringify(this.enrollments[index]));
                const result = confirm('Are you sure you want to un-assign ' +
                this.enrollments[index].this_user.username + ' from teaching ' +
            this.enrollments[index].this_class.title + '?');
            if (result) {
                this.enrollmentsService.remove(this.enrollments[index].id).subscribe(
                data =>  {},
               error => {
                 if (error.status === 200) {
                   console.log('Got BOGUS Error message.');
                 } else {
               console.log('Error: ' + JSON.stringify( error)); }

               this.loadInEnrollments();
             }
              );
            }
            }
            loadInEnrollments() {
                this.enrollmentsService.getEnrollments().subscribe(
                    data => { this.enrollments = data;
                        if (this.enrollments) {
                            this.enrollments.map( enrollment => {
                                enrollment.this_user = this.userService.getUserFromMemoryById(enrollment.user_id);
                    enrollment.this_class = this.classService.getClassFromMemory(enrollment.class_id);
                            });
                        }
                    console.log(' Enrollments: ' + JSON.stringify(data)); },
                    error => console.log('error getting enrollments after post.'),
                    () => {
                    console.log('Instructor Enrollments: ' + JSON.stringify(this.enrollments));
                   // this.assignUserObjects();
                    console.log('done getting new enrollments');
                  this.router.navigate(['/enrollments/instructors']);

                }
                );
            }

    postAssignment() {
        if (this.enrollmentForm.dirty && this.enrollmentForm.valid) {

        // This is Deborah Korata's way of merging our data model with the form model
     const comboObject = Object.assign( {}, {}, this.enrollmentForm.value);
    const chosenUser = this.userService.getUserFromMemoryById(comboObject.user_id);
    const chosenClass = this.classService.getClassFromMemory(comboObject.class_id);

    if (!this.unique(comboObject)) {
        this.enrollmentForm.reset();
        this.feedback = chosenUser.username + ' is already assigned to teach ' + chosenClass.title;

    } else {

     this.enrollmentsService.postEnrollment( comboObject ).subscribe(
       (val) => {

         },
         response => { this.router.navigate(['/coursebuilder']);
         },
         () => {

        this.enrollmentForm.reset();
        this.feedback = null;

        // Add this new assignment to our main enrollments data object!  There's an idea!
        comboObject.this_user = chosenUser;
        comboObject.this_class = chosenClass;
        this.enrollments.push(comboObject);
        // this.loadInEnrollments();
         //  this.router.navigate(['/enrollments/instructors']);


               }
   );
}
}}
}
