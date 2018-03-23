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
import { Material } from '../../models/material.model';
import {Location} from '@angular/common';

@Component({
    moduleId: module.id,
    templateUrl: 'materials.component.html',
    styleUrls: ['materials.component.css']
})

export class MaterialsComponent implements OnInit {

    // classArray: ClassModel[];
    // seriesArray: Series[];
    // courseArray: Course[];
    types: any[];
    data: MaterialCollection;
    materials: Material[];
    errorMessage: string;
    // images: Material[];
    // videos: Material[];
    // public docs: Material[];
    // public books: Material[];
    // public audios: Material[];
    // public blocks: Material[];
    // public quotes: Material[];
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
                // this.images = this.data['images'];
                // this.videos = this.data['videos'];
                // this.audios = this.data['audios'];
                // this.blocks = this.data['blocks'];
                // this.docs = this.data['docs'];
                // this.books = this.data['books'];
                // this.quotes = this.data['quotes'];

               // this.myCollection = [];
              //  this.myCollection['image'] = this.images;

          //      console.log( ' my Collection[image]: ' + JSON.stringify( this.myCollection['image']));
                // this.myCollection['video'] = this.videos;
                // this.myCollection['audio'] = this.audios;
                // this.myCollection['block'] = this.blocks;
                // this.myCollection['doc'] = this.docs;
                // this.myCollection['book'] = this.books;
                // this.myCollection['quote'] = this.quotes;
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
    // getAssets(type) {
    //     this.materialService.getDynamicMaterials(0, type).subscribe(
    //       data => { this.data[type] = data;
    //         // console.log('');
    //         // console.log(type + ':');
    //         // console.log( JSON.stringify( this.data[type]) );
    //       },
    //       error => this.errorMessage = <any> error);
    //   }


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
