import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Globals } from '../../globals';
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


@Component({
    moduleId: module.id,
    templateUrl: 'content.component.html',
    styleUrls: ['content.component.css']
})

export class ContentComponent implements OnInit {

    classArray: ClassModel[];
    seriesArray: Series[];
    courseArray: Course[];
    types: any[];
    data: MaterialCollection;
    errorMessage: string;

    constructor(private router: Router, private activated_route: ActivatedRoute, private fb: FormBuilder,
        private globals: Globals, private userService: UserService, private enrollmentsService: EnrollmentsService,
    private classService: ClassService, private materialService: MaterialService ) {
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

}
