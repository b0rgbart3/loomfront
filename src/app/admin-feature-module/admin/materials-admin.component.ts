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
import { Material } from '../../models/material.model';
import {Location} from '@angular/common';

@Component({
    moduleId: module.id,
    templateUrl: 'materials-admin.component.html',
    styleUrls: ['materials-admin.component.css']
})

export class MaterialsAdminComponent implements OnInit {


    types: any[];
    data: MaterialCollection;
    materials: Material[];
    removed: Material[];
    errorMessage: string;

    myCollection: any[];
    order: string;
    reverse: boolean;


    constructor(private router: Router, private activated_route: ActivatedRoute, private fb: FormBuilder,
        private globals: Globals, private userService: UserService, private enrollmentsService: EnrollmentsService,
    private classService: ClassService, private materialService: MaterialService ) {
       // this.data = new MaterialCollection([], [], [], [], [], [], []);

     }


    ngOnInit() {

        this.data = null;
        // this.globals.materialTypes.map( type => this.getAssets(type.type));

        this.types = this.globals.materialTypes;
        this.order = this.types[0];
       // console.log('In Content Component init.');

        this.activated_route.data.subscribe(
            data => {

            this.data = this.materialService.sortMaterials(data.materials);
            this.materials = data.materials;
            this.removed = this.materialService.removed;
            console.log('In Materials Admin component: ' + JSON.stringify(this.removed));
            }
        );
    }

    setOrder(value: string) {
        if (this.order === value) {
          this.reverse = !this.reverse;
        } else {
        this.order = value;
        this.reverse = true;
        }
    }
    recover(object) {
        this.materialService.recover(object).subscribe(
            data => {
             //  this.materials.push(data);
               console.log('back from recovering material'); }, error => {
                console.log('error recovering material');
            }, () => { console.log('finished recovering material');
            this.data = this.materialService.sortMaterials(this.materials);
            this.removed = this.materialService.removed;
                }
        );
    }

      addAsset(typeIndex) {
        console.log('Adding an asset of type: ' + this.globals.materialTypes[typeIndex].type);
        const addAssetString = '/admin/' + this.globals.materialTypes[typeIndex].type + '/0/edit';
        console.log('add asset string: ' + addAssetString);
        this.router.navigate( [ addAssetString ] );
      }
      editAsset(typeIndex, assetID) {
        const editAssetString = '/admin/' + this.globals.materialTypes[typeIndex].type + '/' + assetID + '/edit' ;
        this.router.navigate( [ editAssetString]);
      }

}
