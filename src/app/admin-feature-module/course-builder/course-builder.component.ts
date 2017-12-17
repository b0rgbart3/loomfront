import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseService } from '../../courses/course.service';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../models/material.model';
import { MaterialCollection } from '../../models/materialcollection.model';
import { Router } from '@angular/router';

@Component ({
    templateUrl: './course-builder.component.html',
    styleUrls: ['./course-builder.component.css']
})

export class CourseBuilderComponent implements OnInit {

courses: Course[];
courseCount: number;
books: Material[];
docs: Material[];
bookCount: number;
errorMessage: string;
assets = ['book', 'PDFdocument', 'video'];
assetTypes = ['books', 'docs', 'videos'];
assetLongSingularNames: string[];
assetLongPluralNames: string[];
data: MaterialCollection;


constructor (
private courseService: CourseService,
private materialService: MaterialService,
private router: Router
) {

  this.data = new MaterialCollection([], [], [], []);

}

ngOnInit() {
  this.getCourses();
  this.assets.map(type => this.getAssets(type));
  this.assetLongPluralNames = ['Books', 'PDF Documents', 'Videos'];
  this.assetLongSingularNames = ['Book', 'PDF Document', 'Video'];
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
        console.log('');
        console.log(type + ':');
                console.log( JSON.stringify( this.data[type]) ); },
      error => this.errorMessage = <any> error);
  }

  addAsset(typeIndex) {
    this.router.navigate( [ '/' + this.assetTypes[typeIndex] + '/0/edit'] );
  }
  editAsset(typeIndex, assetID) {
    this.router.navigate( [ '/' + this.assetTypes[typeIndex] + '/' + assetID + '/edit' ]);
  }
    // getBooks() {
    //   this.materialService.getDynamicMaterials(0, 'book').subscribe(
    //     books => this.books = books,
    //     error => this.errorMessage = <any> error);
    // }

    // getDocs() {

    //   this.materialService.getDynamicMaterials(0, 'PDFdocument').subscribe(
    //     docs => { this.docs = docs;
    //       console.log('Got docs: ' + JSON.stringify(docs)); },
    //     error => this.errorMessage = <any> error);
    // }


}
