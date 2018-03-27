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

@Injectable()
export class CoursesResolver implements Resolve <Course> {

    constructor( private courseService: CourseService, private router: Router ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <Course> {

    //    console.log('In the course(s) resolver.');
        return this.courseService.getCourses().
        map(courses => { if (courses) {
            // console.log('got courses back from the api: ' + JSON.stringify(courses));
            return courses; }
        return null; })
    .catch(error => {
        console.log(`Retrieval error: ${error}`);
        this.router.navigate(['/welcome']);
        return Observable.of(null);
    });
    }
}
