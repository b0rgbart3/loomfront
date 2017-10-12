import { Component, OnInit } from '@angular/core';
import { Course } from '../models/course.model';
import { User } from '../models/user.model';
import { Asset } from '../models/asset.model';
import { ClassModel } from '../models/class.model';
import { CourseService } from '../courses/course.service';
import { Router } from '@angular/router';
import { ClassService } from '../classes/class.service';
import { UserService } from '../users/user.service';
import { AssetService } from '../assets/asset.service';
import { AuthenticationService } from '../services/authentication.service';
import { MaterialService } from '../materials/material.service';
import { Material } from '../models/material.model';
import { Classregistration } from '../models/classregistration.model';
import { Classregistrationgroup } from '../models/classregistrationgroup.model';
import { Avatar } from '../models/avatar.model';
const AVATAR_IMAGE_PATH = 'http://localhost:3100/avatars/';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: []
})

export class AdminComponent implements OnInit {

  courses: Course[];
  classes: ClassModel [];
  users: User [];
  errorMessage: string;
  courseCount: number;
  assets: Asset [];
  username: string;
  materials: Material [];
  chart: Object [];
  regs: Object[];
  test: true;
  userFat: string[]; // a list of userids
  avatars: Avatar[];
  userChart: Object[];

  classregistrations: Classregistrationgroup;

  constructor(
    private courseService: CourseService,
    private classService: ClassService,
    private materialService: MaterialService,
    private router: Router,
    public userService: UserService,
    private assetService: AssetService,
    private authenticationService: AuthenticationService,
  ) {

  }

  ngOnInit() {
    this.userService.ngOnInit();
    this.test = true;
    this.getUsers();
    this.getClasses();
    this.getCourses();
    this.getMaterials();
    this.getClassregistrations();
    this.username = localStorage.getItem('username');

  }

  getClasses() {
  this.classService
  .getClasses().subscribe(
    classes =>  this.classes = classes,
    error => this.errorMessage = <any>error);
  }

  getCourses() {
  this.courseService
  .getCourses().subscribe(
    courses =>  {this.courses = courses;
    this.courseCount = this.courses.length; },
    error => this.errorMessage = <any>error);

  }

  getUsers() {
  this.userService
  .getUsers().subscribe(
    users =>  {this.users = users;
      // console.log(JSON.stringify(this.users));
    },
    error => this.errorMessage = <any>error);
  }

  buildUserChart() {
  //   this.userFat = [];
  //   for (let u = 0; u < this.users.length; u++) {
  //     this.userFat.push(this.users[u].id);
  //   }
  //  // console.log(JSON.stringify(this.userFat));

  //   this.avatars = [];
  //   for (let f = 0; f < this.userFat.length; f++) {
  //     this.userService.getAvatar(this.userFat[f]).subscribe(
  //       (avatar) => { this.avatars.push( avatar[0] );
  //         // create an Avatar Chart Object?

  //      // console.log('Got avatars: ' + JSON.stringify(this.avatars));
  //     },
  //       (error) => this.errorMessage = <any>error);
  //   }
  }

  // this method returns a User object from our local User Object array
  // rather than asking the service or the API for it.
  // Because we're really just trying to find the User who's id
  // matches this parameter.
  localGetUser( userId ) {
    let foundUser = {};

    if (this.users) {
      for (let i = 0; i < this.users.length; i++) {

        if (this.users[i].id.toString() === userId.toString()) {
          foundUser = this.users[i];
          return foundUser;
        }
      }
    }
  }


  buildCRegChart() {
    // I have to rebuild this since I restructured the collection in the db





    // const chart = [];
    // const userObjects = [];

    // // console.log('crsCount: ' + crsCount);

    // if (this.classes && this.users && this.classregistrations) {

    //   const classCount = this.classes.length;
    // const crsCount = this.classregistrations.length;

    // for (let i = 0; i < classCount; i++ ) {

    //   chart[i] = [];
    //   // console.log('Class: ' + JSON.stringify( this.classes[i] ) );

    //   const userArray = [];
    //   for (let j = 0; j < crsCount; j++ ) {
    //     // console.log('CHECKING THIS CLASS REG');
    //     // console.log( 'cr_class_id: ' + this.classregistrations[j].class_id );
    //     // console.log ('classes_id: ' + this.classes[i].id );
    //     if ( this.classregistrations[j].class_id.toString() === this.classes[i].id.toString() ) {


    //       // we have found a reg that corresponds to this class index
    //       // so now we need to grab the User that this reg refers to,
    //       // and store that object here in our new chart that we're building
    //       const refUID = this.classregistrations[j].user_id;

    //       const refUser = this.localGetUser(refUID);
    //       // console.log ( 'Reg user: ' + JSON.stringify(refUser) );
    //       userArray.push( refUser );
    //     }
    //   }
    //   // I'm creating this chart as an array of objects that have both the
    //   // class ID and the User objects as a nested array -- all in a single object
    //   // because we can't just use the index of this loop to stand in for the
    //   // class id.  We need to explicitly save it in our new chart.

    //   chart[i].push({ 'class_id': this.classes[i].id, 'class_title': this.classes[i].title, 'users': userArray} );
    // }
    // // We should have a pretty nifty chart now - so let's output it and see what we've got

    //  this.chart = chart;
    //  console.log('This chart:');
    //  console.log( chart );
    // }    else {
    //   console.log('Could not build the registration chart because the data is not back from the server yet.');
    // }
  }

  getClassregistrations() {
    this.userService
    .getClassregistrations().subscribe(
      classregistrations =>  {this.classregistrations = classregistrations;
      // console.log('ClassRegistrations: ' + JSON.stringify( classregistrations) );
        this.regs = this.classregistrations.regs;
      // I need to build a chart of users, organized by the Class they are registered for.
      // So I guess that means building a double nested array of objects where the outer
      // array key is the class and the inner array key is the user objects

          this.buildCRegChart();
          this.userChart = this.userService.buildUserChart();

    },
      error => this.errorMessage = <any>error);
    }

  getMaterials() {
    this.materialService
    .getMaterials().subscribe(
      materials =>  this.materials = materials,
      error => this.errorMessage = <any>error);
    }

  getAssets() {
    this.assetService
    .getAssets().subscribe(
      assets =>  this.assets = assets,
      error => this.errorMessage = <any>error);
    }

  deleteCourse(courseId) {

    const result = confirm( 'Are you sure you want to delete this course? ');
    if (result) {
    this.courseService.deleteCourse(courseId).subscribe(
      data => {
      this.getCourses(); },
      error => this.errorMessage = <any>error );
   }
  }

  deleteClass(classId) {
    const result = confirm( 'Are you sure you want to delete this class? ');
    if (result) {
    this.classService.deleteClass(classId).subscribe(
      data => {
      this.getClasses(); },
      error => this.errorMessage = <any>error );
    }
  }

  deleteUser(userId) {
    const result = confirm( 'Are you sure you want to delete this user? ');
    if (result) {
    this.userService.deleteUser(userId).subscribe(
      data => {
        this.getUsers(); },
        error => this.errorMessage = <any> error );

    }
  }
  
  deleteMaterial(materialId) {
    const result = confirm( 'Are you sure you want to delete this material? ');
    if (result) {
    this.materialService.deleteMaterial(materialId).subscribe(
      data => {
      this.getMaterials(); },
      error => this.errorMessage = <any>error );
    }
  }


}
