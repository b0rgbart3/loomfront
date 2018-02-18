import { Component, OnInit, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Enrollment } from '../models/enrollment.model';
import { EnrollmentsService } from '../services/enrollments.service';
import { UserService } from '../services/user.service';
import { ClassService } from '../services/class.service';


@Injectable()
export class EnrollmentsResolver implements Resolve <Enrollment[]> {

    enrollments: Enrollment[];
    constructor( private router: Router, private userService: UserService,
        private classService: ClassService,
        private enrollmentsService: EnrollmentsService ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <Enrollment[]> {

        return this.enrollmentsService.getEnrollments().map( data => { this.enrollments = data;
        // console.log('got data back from the API for enrollments: ' + JSON.stringify(data));
        this.enrollments.map( enrollment => {
            // grab the actual user object using the ID# that's stored in the enrollment object in the DB
            enrollment.this_user = this.userService.getUserFromMemoryById(enrollment.user_id);
            enrollment.this_class = this.classService.getClassFromMemory(enrollment.class_id);
        });

    return data; })
    .catch(error => {
        this.router.navigate(['/welcome']);
        return Observable.of(null);
    });
    }


}
