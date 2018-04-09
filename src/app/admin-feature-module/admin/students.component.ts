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
    templateUrl: 'students.component.html',
    styleUrls: ['students.component.css']
})

export class StudentsComponent implements OnInit {


    users: User[];
    enrollments: Enrollment[];
    classes: ClassModel[];
    constructor(private router: Router, private activated_route: ActivatedRoute, private fb: FormBuilder,
        private globals: Globals, private userService: UserService, private enrollmentsService: EnrollmentsService,
    private classService: ClassService ) { }


    ngOnInit() {
        this.activated_route.data.subscribe(
            data => {
             //   console.log('Got new data!');
            this.users = data['users'];
            this.enrollments = data['enrollments'];
            this.classes = data['classes'];
             //   console.log('Users: ' + JSON.stringify(this.users));
            }

        );

    }

}
