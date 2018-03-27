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
// get the enrollments that the currentUser is a student in

export class EnrollmentsResolver implements Resolve <Enrollment[]> {

    enrollments: Enrollment[];
    constructor( private router: Router, private enrollmentsService: EnrollmentsService,
        private classService: ClassService, private userService: UserService ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <Enrollment[]> {

//         console.log('IN STUDENT ENROLLMENTS RESOLVER');
        return this.enrollmentsService.getEnrollments().map( data => { this.enrollments = data;
         // console.log('got data back from the API for current users student enrollments: ' + JSON.stringify(data));
         if (this.enrollments) {
            // console.log('found student objects');
            // console.log('Mapping:');
         this.enrollments.map( enrollment => {
          //   console.log('User id: ' + enrollment.user_id );
             enrollment.this_user = this.userService.getUserFromMemoryById(enrollment.user_id);
            if (enrollment.this_user) {
                // console.log('found user: ' + JSON.stringify(enrollment.this_user));
            }
            } );
         this.enrollments.map( enrollment => { enrollment.this_class = this.classService.getClassFromMemory(enrollment.class_id); } );
        //    console.log('Done mapping user objects.');
        }
    return this.enrollments; })
    .catch(error => {
        this.router.navigate(['/welcome']);
        return Observable.of(null);
    });
    }


}
