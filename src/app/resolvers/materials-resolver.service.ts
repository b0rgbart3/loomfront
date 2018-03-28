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
import { MaterialService } from '../services/material.service';
import { Material } from '../models/material.model';
import { MaterialCollection } from '../models/materialcollection.model';

/*
 *
 *  This resolver loads in all the materials for a given course
 *  as a nested array of material objects - organized by section #
 */

@Injectable()
export class MaterialsResolver implements Resolve <any> {

    thisClass: ClassModel;
    thisCourseID: string;
    thisCourse: Course;
    allMaterials: Material[];
    materialIDs: string[][];
    theseMaterials: Material[][];
    materialCollections: MaterialCollection[];
    routeData: any[];

    constructor( private courseService: CourseService,
        private classService: ClassService, private router: Router,
        private materialService: MaterialService,
    private activatedRoute: ActivatedRoute ) { }

    resolve( route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot ): Observable <any> {

        this.allMaterials = route.parent.data['allMaterials'];
       // Get ALL the friggin materials -- from the parent resolver

       this.thisCourseID = route.parent.data['thisClass'].course;
     //  console.log('This CourseID: ' + JSON.stringify(this.thisCourseID));
       this.thisCourse = this.courseService.getCourseFromMemory(this.thisCourseID);

     // console.log('This COURSE: ' + JSON.stringify(this.thisCourse));
    //  console.log('---------------');


      // OK - we have the Class, we have the Course -- we have ALL the materials.
      // NOW can we fucking get something done??

      this.materialIDs = this.thisCourse.sections.map( section => section.materials );

     // console.log('Material IDS: ' + JSON.stringify(this.materialIDs));
      // Before I can sort the materials -- I have to collect the ACTUAL material objects -- not just the IDS.

      this.theseMaterials = this.materialIDs.map( list => this.materialService.getBatchMaterialsFromMemory(list));

//      this.materialCollections = this.theseMaterials.map( group => this.materialService.sortMaterials(group));

        return Observable.of(this.theseMaterials);

        // console.log('Activated route snapshot CourseObject: ' + JSON.stringify(thisCourse));

        // const materialIDLists = thisCourse.sections.map( section => section.materials );

        // I now have an array of material ID's - organized by section
        // do I now load in all the material objects related to those ids?  and then organize them into collections?
        // Yes, I think so.  But how can I return an observable, when I'm trying to MAP an entire array of get requests?
        // Does a resolver NEED to return an Observable?
        // Can it be an "Observable" of an array (which is really just a fake Observable)?



  }
}
