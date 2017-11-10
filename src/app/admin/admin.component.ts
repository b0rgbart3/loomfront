import { Component, OnInit } from '@angular/core';
import { Course } from '../models/course.model';
import { User } from '../models/user.model';
// import { Asset } from '../models/asset.model';
import { ClassModel } from '../models/class.model';
import { CourseService } from '../courses/course.service';
import { Router } from '@angular/router';
import { ClassService } from '../classes/class.service';
import { UserService } from '../users/user.service';

import { MaterialService } from '../materials/material.service';
import { Material } from '../models/material.model';
import { Userthumbnail } from '../models/userthumbnail.model';
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
  instructors: User[];
  errorMessage: string;
  courseCount: number;
  // assets: Asset [];
  username: string;
  materials: Material [];
  public instructorThumbnails: Userthumbnail[];
  public userThumbnails: Userthumbnail[];


  constructor(
    private courseService: CourseService,
    private classService: ClassService,
    private materialService: MaterialService,
    private router: Router,
    public userService: UserService
  ) {

  }

  ngOnInit() {
    this.userService.ngOnInit();
    this.getUsers();
    this.getClasses();
    this.getCourses();
    this.getMaterials();
    this.getInstructors();
    this.username = localStorage.getItem('username');


  }

  createThumbnail(user) {
    const thumbnailObj = { user: user, user_id: user.id, editable: false, inRoom: true, size: 125, showUsername: true, showInfo: true };
    return thumbnailObj;
  }

  createEditableThumbnail(user) {
    const thumbnailObj = { user: user, user_id: user.id, editable: true, inRoom: true, size: 125, showUsername: true, showInfo: true };
    return thumbnailObj;
  }

  getInstructors() {
    this.userService.getInstructors(0).subscribe(
      instructors =>  {this.instructors = instructors;
        this.instructorThumbnails = this.instructors.map(this.createThumbnail);
        // console.log('Instructors: ' + JSON.stringify(this.instructors ) );
      console.log(this.instructors.length); },
      error => this.errorMessage = <any>error);
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

    this.userThumbnails = this.users.map(this.createEditableThumbnail);
    },
    error => this.errorMessage = <any>error);
  }

  getMaterials() {
    this.materialService
    .getMaterials(0).subscribe(
      materials =>  this.materials = materials,
      error => this.errorMessage = <any>error);
    }

  // getAssets() {
  //   this.assetService
  //   .getAssets().subscribe(
  //     assets =>  this.assets = assets,
  //     error => this.errorMessage = <any>error);
  //   }

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
      // this.getMaterials();
     },
      error => this.errorMessage = <any>error );
    }
  }


}
