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

/*
 *
 *
 *  NOTE:  This resolver is designed to work with the Course Edit Component -- so it
 *  resolves the course data based on the id of the URL.
 *  Note however that this does NOT work for the Student view - which has url
 *  params of Class ID and section ID.  In that case the course ID is nested
 *  in the Class Object
 */

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
            const newCourse = new Course('', '', '0', [], '', false);
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
