import { Component, OnInit, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
//import { Observable } from 'rxjs/Observable';
import {Observable,of, from } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Enrollment } from '../models/enrollment.model';
import { EnrollmentsService } from '../services/enrollments.service';
import { UserService } from '../services/user.service';
import { ClassService } from '../services/class.service';
import { AssignmentsService } from '../services/assignments.service';
import { Assignment } from '../models/assignment.model';


@Injectable()
export class AllAssignmentsResolver implements Resolve <Assignment[]> {

    assignments: Assignment[];
    constructor( private router: Router, private assignmentsService: AssignmentsService,
        private classService: ClassService, private userService: UserService ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <Assignment[]> {
      //  console.log('All Assignments RESOLVER');
        return this.assignmentsService.getAllAssignments().map( data => {
            this.assignments = data;
     //    console.log('got data back from the service into the resolver for all instructor assignments : ' + JSON.stringify(data));
         if (this.assignments) {
       //      console.log('mapping the user objects to the assignment objects');
         this.assignments.map( assignment => { assignment.this_user = this.userService.getUserFromMemoryById(assignment.user_id); } );
         this.assignments.map( assignment => { assignment.this_class = this.classService.getClassFromMemory(assignment.class_id); } ); 
       // console.log('Assignments now: ');
         // console.log(JSON.stringify(this.assignments));
        }
    return this.assignments; })
    .catch(error => {
        this.router.navigate(['/welcome']);
        return Observable.of(null);
    });
    }


}
