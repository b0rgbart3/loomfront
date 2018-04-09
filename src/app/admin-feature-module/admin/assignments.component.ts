import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Globals } from '../../globals2';
import { Enrollment } from '../../models/enrollment.model';
import { ClassModel } from '../../models/class.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ClassService } from '../../services/class.service';
import { AssignmentsService } from '../../services/assignments.service';
import { Assignment } from '../../models/assignment.model';


@Component({
    moduleId: module.id,
    selector: 'assignments',
    templateUrl: 'assignments.component.html',
    styleUrls: ['assignments.component.css']
})

export class AssignmentsComponent implements OnInit {
    form: FormGroup;
    assignments: Assignment[];
    instructors: User[];
    classes: ClassModel[];
    users: User[];
  feedback: string;



    constructor(private router: Router, private activated_route: ActivatedRoute, private fb: FormBuilder,
        private globals: Globals, private userService: UserService, private assignmentsService: AssignmentsService,
    private classService: ClassService ) { }

        // The form control names match the Enrollment Data Model.  Nice!

    ngOnInit() {

        this.activated_route.data.subscribe(
            data => {
          //  console.log('Got new data!');
            this.assignments = data['assignments'];
           // console.log(' Assignments: ' + JSON.stringify(data));
            this.classes = data['classes'];
            this.users = data['users'];
            this.instructors = data['instructors'];
            }
        );

        this.form = this.fb.group({
            user_id: [ '', Validators.required ],
            class_id: [ '', Validators.required ],
            });

    }


    unique( object ) {
        // We don't want to have a duplicate in the DB
                let unique = true;
                for (let i = 0; i < this.assignments.length; i++) {
                    if (object.user_id === this.assignments[i].user_id) {
                        if ( object.class_id === this.assignments[i].class_id) {

                                unique = false;

                        }
                    }
                }
                return unique;
            }

            trash(index) {
                let nameOfPerson = '';
                if (this.assignments && this.assignments[index] && this.assignments[index].this_user) {
                    nameOfPerson = this.assignments[index].this_user.username;
                }
                let classTitle = '';
                if (this.assignments && this.assignments[index] && this.assignments[index].this_class) {
                    classTitle = this.assignments[index].this_class.title;
                } else {
                    console.log('class: ' + JSON.stringify(this.assignments[index].this_class));
                }
                // console.log('about to delete: ' + JSON.stringify(this.assignments[index]));
                const result = confirm('Are you sure you want to un-assign ' + nameOfPerson +
                 ' from teaching ' + classTitle + '?');
            if (result && this.assignments[index]) {
                this.assignments.splice(index, 1 );
                this.assignmentsService.remove(this.assignments[index].id).subscribe(
                data =>  {},
               error => {
                 if (error.status === 200) {
                   console.log('Got BOGUS Error message.');
                 } else {
               console.log('Error: ' + JSON.stringify( error)); }

              // this.loadInAssignments();
             }
              );
            }
            }
            loadInAssignments() {
                this.assignmentsService.getAssignments().subscribe(
                    data => { this.assignments = data;
                        if (this.assignments) {
                            this.assignments.map( enrollment => {
                                enrollment.this_user = this.userService.getUserFromMemoryById(enrollment.user_id);
                                 enrollment.this_class = this.classService.getClassFromMemory(enrollment.class_id);
                            });
                        }
                    console.log(' Enrollments: ' + JSON.stringify(data)); },
                    error => console.log('error getting enrollments after post.'),
                    () => {
                    console.log('Instructor Assignments: ' + JSON.stringify(this.assignments));
                   // this.assignUserObjects();
                    console.log('done getting new assignments');
                  // this.router.navigate(['/enrollments/instructors']);

                }
                );
            }

    postAssignment() {
        if (this.form.dirty && this.form.valid) {

        // This is Deborah Korata's way of merging our data model with the form model
     const comboObject = Object.assign( {}, {}, this.form.value);
    const chosenUser = this.userService.getUserFromMemoryById(comboObject.user_id);
    const chosenClass = this.classService.getClassFromMemory(comboObject.class_id);

    if (!this.unique(comboObject)) {
        this.form.reset();
        this.feedback = chosenUser.username + ' is already assigned to teach ' + chosenClass.title;

    } else {

     this.assignmentsService.postAssignment( comboObject ).subscribe(
       (val) => {
            console.log('got val back');
         },
         response => {
             console.log('got resonse back');
         },
         () => {
             console.log('got back from posting.');

        this.form.reset();
        this.feedback = null;

        // Add this new assignment to our main enrollments data object!  There's an idea!
        comboObject.this_user = chosenUser;
        comboObject.this_class = chosenClass;
        this.assignments.push(comboObject);
        // this.loadInEnrollments();
         //  this.router.navigate(['/enrollments/instructors']);


               }
   );
}
}}
}
