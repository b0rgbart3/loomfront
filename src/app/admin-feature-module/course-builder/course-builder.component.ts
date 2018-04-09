import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../models/material.model';
import { MaterialCollection } from '../../models/materialcollection.model';
import { Router } from '@angular/router';
import { Globals } from '../../globals2';

@Component ({
    templateUrl: './course-builder.component.html',
    styleUrls: ['./course-builder.component.css']
})

export class CourseBuilderComponent implements OnInit {

courses: Course[];
courseCount: number;
books: Material[];
docs: Material[];
images: Material[];
bookCount: number;
errorMessage: string;

data: MaterialCollection;
types: any[];

constructor (
private courseService: CourseService,
private materialService: MaterialService,
private router: Router,
private globals: Globals
) {

  this.data = new MaterialCollection([], [], [], [], [], [], []);

}

ngOnInit() {
  this.getCourses();

  this.globals.materialTypes.map( type => this.getAssets(type.type));

  this.types = this.globals.materialTypes;
}

getCourses() {
    this.courseService
    .getCourses().subscribe(
      courses =>  {this.courses = courses;
      this.courseCount = this.courses.length; },
      error => this.errorMessage = <any>error);
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


  checkDataStream() {
    // make sure we still have a connection to the Database.
    // this.courseService.getCourses()
  }

}
