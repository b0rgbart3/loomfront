import { Component, OnInit, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { UserService } from '../services/user.service';
import { ClassService } from '../services/class.service';
import { AssignmentsService } from '../services/assignments.service';
import { Assignment } from '../models/assignment.model';


@Injectable()
export class AssignmentsResolver implements Resolve <Assignment[]> {

    assignments: Assignment[];
    constructor( private router: Router, private assignmentsService: AssignmentsService,
        private classService: ClassService, private userService: UserService ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <Assignment[]> {
        this.assignments = null;
        // console.log('Aassignments RESOLVER');
        return this.assignmentsService.getAssignments().map( data => {
         // console.log('got data back from the API for enrollments: ' + JSON.stringify(data));
         this.assignments = data;
         if (this.assignments) {
        //     console.log('found instructor objects');
         this.assignments.map( assignment => { assignment.this_user = this.userService.getUserFromMemoryById(assignment.user_id); } );
         this.assignments.map( assignment => { assignment.this_class = this.classService.getClassFromMemory(assignment.class_id); } );
         } else {
            // console.log('nothing in the assignments variable.');
         }
    return this.assignments; })
    .catch(error => {
        // this.router.navigate(['/welcome']);
        return Observable.of(null);
    });
    }


}
