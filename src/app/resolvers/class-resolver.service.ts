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

@Injectable()
export class ClassResolver implements Resolve <ClassModel> {

    constructor( private activatedRoute: ActivatedRoute,
        private courseService: CourseService,
        private classService: ClassService, private router: Router ) { }

    resolve( route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable <ClassModel> {
        const id = route.params['id'];
      //  console.log('In class resolver, id: ' + id);

        if (id === '0') {
        //    console.log('CREATING NEW EMPTY CLASSMODEL');
            const newClass = new ClassModel('', '', new Date(), new Date(), '0', '', null, '', '', false);
            return Observable.of(newClass); } else {


        return this.classService.getClass(id).
        map(thisClass => { if (thisClass) {
       //   console.log('This class id: ' + id);
        //   console.log('found: ' + JSON.stringify(thisClass));
         //  const foundClass = this.classLinter(thisClass[0]);
         // this.activatedRoute.snapshot.data['thisClass'] = thisClass[0];
            return thisClass[0];
        }
        // console.log(`Class was not found: ${id}`);
      //  this.router.navigate(['/welcome']);
        return null; })
    .catch(error => {
        console.log(`Retrieval error: ${error}`);
    //    this.router.navigate(['/welcome']);
        return Observable.of(null);
    });
    }
  }
}
  // This is a really basic data filter - that will make sure we have
  // section numbers in the section objects of this class.
  // The section #'s should be stored when the class Data gets stored,
  // but that wasn't in the original code so I put this in here as
  // a safety measure to keep things working until I can double check
  // that that's always happening and has happened.
//   classLinter(thisClass) {
//     const firstSection = thisClass.sections[0];

//     // if the first section doesn't have a number assigned to it, then we'll
//     // go ahead and just assign numbers to them as they are in sequence.

//     if (!firstSection.sectionNumber) {
//         for (let i = 0; i < thisClass.sections.length; i ++) {
//             const thisSection = thisClass.sections[i];
//             thisSection.sectionNumber = i; }
//         }
//   }
// }
