import { Component, OnInit, Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ContentChart } from '../models/contentchart.model';
import { CourseService } from '../courses/course.service';
import { ClassService } from '../classes/class.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { User } from '../models/user.model';
import { UserService } from '../users/user.service';

@Injectable()
export class UsersResolver implements Resolve <User[]> {

    constructor( private userService: UserService, private router: Router ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <User[]> {

        console.log('In the Users resolver.');

        return this.userService.getUsers().
        map(course => { if (course) { return course; }
        console.log(`Course was not found:`);
        this.router.navigate(['/welcome']);
        return null; })
    .catch(error => {
        console.log(`Retrieval error: ${error}`);
        this.router.navigate(['/welcome']);
        return Observable.of(null);
    });
    }
}
