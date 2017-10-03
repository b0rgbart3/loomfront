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

  constructor(
    private courseService: CourseService,
    private classService: ClassService,
    private router: Router,
    public userService: UserService,
    private assetService: AssetService,
    private authenticationService: AuthenticationService,
  ) {

  }

  ngOnInit() {
    this.getClasses();
    this.getCourses();
    this.getUsers();
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
    users =>  this.users = users,
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



}
