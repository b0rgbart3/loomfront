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
    templateUrl: 'instructors.component.html',
    styleUrls: ['instructors.component.css']
})

export class InstructorsComponent implements OnInit {


    instructors: User[];
    instructorFormGroup: FormGroup;

    constructor(private router: Router, private activated_route: ActivatedRoute, private fb: FormBuilder,
        private globals: Globals, private userService: UserService, private enrollmentsService: EnrollmentsService,
    private classService: ClassService ) { }


    ngOnInit() {

        this.activated_route.data.subscribe(
            data => {
            this.instructors = data['instructors'];
            }
        );

        this.instructorFormGroup =  this.fb.group({
            user_id: [ '', []],
            });
    }





}
