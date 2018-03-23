import { Component, OnInit, Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ContentChart } from '../models/contentchart.model';
import { CourseService } from '../services/course.service';
import { ClassService } from '../services/class.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Injectable()
export class InstructorsResolver implements Resolve <User[]> {

    constructor( private userService: UserService, private router: Router ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <User[]> {

        return this.userService.getAllInstructors().
        map(data => { if (data) {
       //     console.log('Instructors: ' + JSON.stringify(data));
            return data; }
        // this.router.navigate(['/welcome']);
        return null; })
    .catch(error => {
     //   console.log(`Retrieval error: ${error}`);
       //  this.router.navigate(['/welcome']);
        return Observable.of(null);
    });
    }
}
