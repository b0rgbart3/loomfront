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
import { Series } from '../../models/series.model';
import { Course } from '../../models/course.model';


@Component({
    moduleId: module.id,
    templateUrl: 'content.component.html',
    styleUrls: ['content.component.css']
})

export class ContentComponent implements OnInit {

    classArray: ClassModel[];
    seriesArray: Series[];
    courseArray: Course[];

    constructor(private router: Router, private activated_route: ActivatedRoute, private fb: FormBuilder,
        private globals: Globals, private userService: UserService, private enrollmentsService: EnrollmentsService,
    private classService: ClassService ) { }


    ngOnInit() {

        console.log('In Content Component init.');

        this.activated_route.data.subscribe(
            data => {
            this.classArray = data['classes'];
            this.seriesArray = data['series'];
            this.courseArray = data['courses'];
            }

        );


    }





}
