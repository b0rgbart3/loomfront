import { Component, OnInit, SecurityContext, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Globals } from '../../globals2';
import { Enrollment } from '../../models/enrollment.model';
import { ClassModel } from '../../models/class.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ClassService } from '../../services/class.service';
import { EnrollmentsService } from '../../services/enrollments.service';


@Component({
    selector: 'enrollments',
    moduleId: module.id,
    templateUrl: 'enrollments.component.html',
    styleUrls: ['enrollments.component.css']
})

export class EnrollmentsComponent implements OnInit {
    enrollmentForm: FormGroup;
    feedback: string;
    @Input() users: User[];
    @Input() enrollments: Enrollment[];
    @Input() classes: ClassModel[];


    constructor(private router: Router, private activated_route: ActivatedRoute, private fb: FormBuilder,
        private globals: Globals, private userService: UserService, private enrollmentsService: EnrollmentsService,
    private classService: ClassService ) { }

        // The form control names match the Enrollment Data Model.  Nice!

    ngOnInit() {
        this.feedback = '';
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
        const result = confirm('Are you sure you want to un-enroll ' + this.enrollments[index].this_user.username + ' from ' +
    this.classService.getClassFromMemory(this.enrollments[index].class_id).title + '?');
    if (result) {
        this.enrollmentsService.remove(this.enrollments[index].id).subscribe(
        data =>  {},
       error => {
         if (error.status === 200) {
           console.log('Got BOGUS Error message.');
           this.enrollments.splice(index, 1);
         } else {
       console.log('Error: ' + JSON.stringify( error)); }
     }
      );
    }
    }

    postEnrollment() {
        if (this.enrollmentForm.dirty &&  this.enrollmentForm.valid) {
        // This is Deborah Korata's way of merging our data model with the form model
     const comboObject = Object.assign( {}, {}, this.enrollmentForm.value);
    const chosenUser = this.userService.getUserFromMemoryById(comboObject.user_id);
    const chosenClass = this.classService.getClassFromMemory(comboObject.class_id);

    if (!this.unique(comboObject)) {
        console.log('NOT unique: ' + JSON.stringify(comboObject));
        this.enrollmentForm.reset();
        this.feedback = chosenUser.username + ' is already enrolled in ' + chosenClass.title;
        console.log(this.feedback);
    } else {
        this.feedback = '';
     this.enrollmentsService.postEnrollment( comboObject ).subscribe(
       (val) => {

         },
         response => {
         },
         () => {
this.enrollmentForm.reset();

comboObject.this_user = chosenUser;
comboObject.this_class = chosenClass;
// this.enrollments.push( comboObject );

// console.log('Enrollments: ' + JSON.stringify(this.enrollments));
//  this.loadInEnrollments();
         }
   );
    }
}}
}
