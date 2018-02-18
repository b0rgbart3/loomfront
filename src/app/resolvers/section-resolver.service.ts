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
import { Section } from '../models/section.model';

@Injectable()
export class SectionResolver implements Resolve <number> {

    constructor( private activatedRoute: ActivatedRoute,
        private courseService: CourseService, private classService: ClassService, private router: Router ) { }

    resolve( route: ActivatedRouteSnapshot ) {
        const id = route.params['id'];
        const sectionNumber = route.params['id2'];

      //  console.log('Section Resolver: ' + sectionNumber);
      //  console.log('Route Params: ' + JSON.stringify(route.params));
        if (isNaN( sectionNumber )) {
            return 0;
        } else {
    //   console.log('In Section Resolver: sectionNumber == ' + sectionNumber);


        return sectionNumber; }
    }
}
