import { Component, OnInit, Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Injectable()
export class PossibleInstructorsResolver implements Resolve <User[]> {

    constructor( private userService: UserService, private router: Router ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <User[]> {

        console.log('In the possible instructors resolver.');

        return this.userService.getAllInstructors().
        map(course => { if (course) { return course; }
        console.log(`Possible-Instructors not found`);
        this.router.navigate(['/welcome']);
        return null; })
    .catch(error => {
        console.log(`Retrieval error: ${error}`);
        this.router.navigate(['/welcome']);
        return Observable.of(null);
    });
    }
}
