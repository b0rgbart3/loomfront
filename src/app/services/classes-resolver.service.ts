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
import { ClassModel } from '../models/class.model';

@Injectable()
export class ClassesResolver implements Resolve <ClassModel> {

    constructor( private courseService: CourseService, private classService: ClassService,
        private router: Router ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <ClassModel> {
        const id = route.params['id'];

        if (isNaN(id)) {
            // console.log(`Class id was not a number: ${id}`);
            this.router.navigate(['/welcome']);
            return Observable.of(null);
        }
        console.log('In Classes Resolver: id=' + id);
        return this.classService.getClasses().
        map(thisClass => { if (thisClass) {
            // console.log('This class id: ' + id);
           // console.log('found: ' + JSON.stringify(thisClass));
            return thisClass; }
        // console.log(`Class was not found: ${id}`);
        this.router.navigate(['/welcome']);
        return null; })
    .catch(error => {
       // console.log(`Retrieval error: ${error}`);
        this.router.navigate(['/welcome']);
        return Observable.of(null);
    });
    }
}
