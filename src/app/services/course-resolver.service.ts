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

@Injectable()
export class CourseResolver implements Resolve <Course> {

    constructor( private courseService: CourseService, private classService: ClassService, private router: Router ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <Course> {
        const id = route.params['id'];
       console.log('In the course resolver: ' + id);

        if (isNaN(id)) {
           console.log(`Course id was not a number: ${id}`);
            this.router.navigate(['/welcome']);
            return Observable.of(null);
        }
        if (id === '0' ) {
            console.log('creating a new empty course. ');
            const newCourse = new Course('', '', '0', [], '');
            return Observable.of( newCourse ); }
        return this.courseService.getCourse(id).
        map(course => { if (course) {
            return course[0]; }
            // const delintedCourse = this.deLintMe(course);
            // return delintedCourse; }
       // console.log(`Course was not found: ${id}`);
        this.router.navigate(['/welcome']);
        return null; })
    .catch(error => {
      //  console.log(`Retrieval error: ${error}`);
        this.router.navigate(['/welcome']);
        return Observable.of(null);
    });
    }

    // deLintMe( LintedCourse ) {
    //     if (LintedCourse.sections && LintedCourse.sections.length > 0) {
    //      for (let lcSection = 0; lcSection < LintedCourse.sections.length; lcSection++) {
    //           const sc = LintedCourse.sections[lcSection].content;
    //           const editedSC = sc.replace(/<br>/g, '\n');
    //           console.log('Looking at: ' + sc );
    //           LintedCourse.sections[lcSection].content = editedSC;
    //      } }
    //     const deLintedCourse = LintedCourse;
    //     return deLintedCourse;
    // }
}
