import { Component, OnInit, Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { ContentChart } from '../models/contentchart.model';
import { CourseService } from '../services/course.service';
import { ClassService } from '../services/class.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { ClassModel } from '../models/class.model';

/*
 *
 *  This Course Resolver is different from the main Course Resolver - in that
 *  It needs to get the Course ID # from the Class object that is hopefully
 *  sitting in the Activated Route Snapshot data -- rather than using an id
 *  from the URl.
 */

@Injectable()
export class ClassCourseResolver implements Resolve <any> {

    thisClass: ClassModel;
    thisCourse: Course;

    constructor( private courseService: CourseService, private classService: ClassService, private router: Router,
    private activatedRoute: ActivatedRoute ) { }

    resolve( route: ActivatedRouteSnapshot): Observable <any> {

       // console.log('In the class-course resolver.');
        const thisClass = route.parent.data['thisClass'];
       // console.log('Activated route snapshot ClassObject: ' + JSON.stringify(thisClass));
        return this.courseService.getCourse(thisClass.course).map( thisCourse => { if (thisCourse[0]) {
          this.thisCourse = thisCourse[0];
      //  console.log('Loaded course Info in the resolver: ' + JSON.stringify(this.thisCourse));
        return thisCourse[0];
        }   } ).catch( error => {
       // console.log( ' Retrieval error: course reslover. ');
    return error; });


  }
}
