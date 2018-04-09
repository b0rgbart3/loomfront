import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Globals } from '../../globals2';
import { Enrollment } from '../../models/enrollment.model';
import { ClassModel } from '../../models/class.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ClassService } from '../../services/class.service';
import { EnrollmentsService } from '../../services/enrollments.service';
import { Series } from '../../models/series.model';
import { Course } from '../../models/course.model';
import { MaterialService } from '../../services/material.service';
import { MaterialCollection } from '../../models/materialcollection.model';
import { CourseService } from '../../services/course.service';
import { SeriesService } from '../../services/series.service';


@Component({
    moduleId: module.id,
    templateUrl: 'content.component.html',
    styleUrls: ['content.component.css']
})

export class ContentComponent implements OnInit {

    classArray: ClassModel[];
    removedClasses: ClassModel[];
    seriesArray: Series[];
    removedSeries: Series[];
    courseArray: Course[];
    removedCourses: Course[];
    types: any[];
    data: MaterialCollection;
    errorMessage: string;

    constructor(private router: Router, private activated_route: ActivatedRoute, private fb: FormBuilder,
        private globals: Globals, private userService: UserService, private enrollmentsService: EnrollmentsService,
    private classService: ClassService, private courseService: CourseService, private seriesService: SeriesService,
    private materialService: MaterialService ) {
        this.data = new MaterialCollection([], [], [], [], [], [], []);

     }


    ngOnInit() {

        this.globals.materialTypes.map( type => this.getAssets(type.type));

  this.types = this.globals.materialTypes;
        console.log('In Content Component init.');

        this.activated_route.data.subscribe(
            data => {
            this.classArray = data['classes'];
            this.seriesArray = data['series'];
            this.courseArray = data['courses'];
            this.removedClasses = this.classService.removedClasses;
            this.removedCourses = this.courseService.removedCourses;
            this.removedSeries = this.seriesService.removedSeries;
            }

        );


    }

    getAssets(type) {
        this.materialService.getDynamicMaterials(0, type).subscribe(
          data => { this.data[type] = data;
            // console.log('');
            // console.log(type + ':');
            // console.log( JSON.stringify( this.data[type]) );
          },
          error => this.errorMessage = <any> error);
      }


      addAsset(typeIndex) {
        console.log('Adding an asset of type: ' + this.globals.materialTypes[typeIndex].type);
        const addAssetString = '/' + this.globals.materialTypes[typeIndex].type + '/0/edit';
        console.log('add asset string: ' + addAssetString);
        this.router.navigate( [ addAssetString ] );
      }
      editAsset(typeIndex, assetID) {
        const editAssetString = '/' + this.globals.materialTypes[typeIndex].type + '/' + assetID + '/edit' ;
        this.router.navigate( [ editAssetString]);
      }

      recoverClass(classObject) {
        this.classService.recoverClass(classObject).subscribe(
            data => {

               console.log('back from recovering class'); }, error => {
                console.log('error recovering class');
            }, () => { console.log('finished recovering class');
                }
        );
      }
      recoverCourse(courseObject) {
          this.courseService.recoverCourse(courseObject).subscribe(
              data => {
                // this.courseArray.push(data);
                 console.log('back from recovering course'); }, error => {
                  console.log('error recovering course');
              }, () => { console.log('finished recovering course');
                  }
          );
      }
      recoverSeries(seriesObject) {
        this.seriesService.recoverSeries(seriesObject).subscribe(
            data => {
              // this.courseArray.push(data);
               console.log('back from recovering series'); }, error => {
                console.log('error recovering series');
            }, () => { console.log('finished recovering series');
                }
        );
      }

      reboot() {

      }

}
