import { Component, OnInit, Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { ContentChart } from '../models/contentchart.model';
import { CourseService } from '../courses/course.service';
import { ClassService } from '../classes/class.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { ClassModel } from '../models/class.model';
import { Section } from '../models/section.model';

@Injectable()
export class SectionsResolver implements Resolve <number> {

    constructor( private activatedRoute: ActivatedRoute,
        private courseService: CourseService, private classService: ClassService, private router: Router ) { }

    resolve( section ) {
        const sectionNumber = this.activatedRoute.params['section'];

        if (isNaN( sectionNumber )) {
            return 0;
        } else {
        return sectionNumber; }
    }
}
