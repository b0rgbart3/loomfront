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
import { ClassModel } from '../models/class.model';

@Injectable()
export class ClassesResolver implements Resolve <ClassModel> {

    constructor( private courseService: CourseService, private classService: ClassService,
        private router: Router ) { }

    // console.log('creating the classes resolver');

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <ClassModel> {
//        const id = route.params['id'];

       // console.log('In the classes Resolver');

        // if (isNaN(id)) {
        //     // console.log(`Class id was not a number: ${id}`);
        //     this.router.navigate(['/welcome']);
        //     return Observable.of(null);
        // }
       // console.log('In Classes Resolver:' );
        return this.classService.getClasses().
        map(classes => {
           // console.log('Got claseses, returning them.');
            if (classes) {
            // console.log('This class id: ' + id);
           // console.log('found: ' + JSON.stringify(thisClass));
            return classes; }
        // console.log(`Class was not found: ${id}`);
        // this.router.navigate(['/welcome']);
        return null; })
    .catch(error => {
       // console.log(`Retrieval error: ${error}`);
        // this.router.navigate(['/welcome']);
        return Observable.of(null);
    });
    }
}
