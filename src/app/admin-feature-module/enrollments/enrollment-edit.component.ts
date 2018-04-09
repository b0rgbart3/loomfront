import { Component, OnInit, SecurityContext } from '@angular/core';
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
    moduleId: module.id,
    templateUrl: 'enrollment-edit.component.html',
    styleUrls: ['enrollment-edit.component.css']
})

export class EnrollmentEditComponent implements OnInit {
    enrollmentForm: FormGroup;
    enrollments: Enrollment[];
    classes: ClassModel[];
    users: User[];

    constructor(private router: Router, private activated_route: ActivatedRoute, private fb: FormBuilder,
        private globals: Globals, private userService: UserService, private enrollmentsService: EnrollmentsService,
    private classService: ClassService ) { }

        // The form control names match the Enrollment Data Model.  Nice!

    ngOnInit() {
        this.enrollments = this.activated_route.snapshot.data['enrollments'];
        this.classes = this.activated_route.snapshot.data['classes'];
        this.users = this.activated_route.snapshot.data['users'];

        for (let i = 0; i < this.enrollments.length; i++) {
            this.enrollments[i].this_user =
            this.userService.getUserFromMemoryById('' + this.enrollments[i].user_id);
            this.enrollments[i].this_class =
            this.classService.getClassFromMemory(this.enrollments[i].class_id);
        }




    }


    closer() {
        this.router.navigate(['/home']);
    }


}
