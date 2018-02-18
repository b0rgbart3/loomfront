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
export class AllInstructorAssignmentsResolver implements Resolve <Enrollment[]> {

    enrollments: Enrollment[];
    constructor( private router: Router, private enrollmentsService: EnrollmentsService,
        private classService: ClassService, private userService: UserService ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <Enrollment[]> {
        console.log('All INSTRUCTOR RESOLVER');
        return this.enrollmentsService.getAllInstructorAssignments().map( data => {
            this.enrollments = data;
         console.log('got data back from the API for all instructor assignments : ' + JSON.stringify(data));
         if (this.enrollments) {
         this.enrollments.map( enrollment => { enrollment.this_user = this.userService.getUserFromMemoryById(enrollment.user_id); } );
         this.enrollments.map( enrollment => { enrollment.this_class = this.classService.getClassFromMemory(enrollment.class_id); } ); }
    return this.enrollments; })
    .catch(error => {
        this.router.navigate(['/welcome']);
        return Observable.of(null);
    });
    }


}
