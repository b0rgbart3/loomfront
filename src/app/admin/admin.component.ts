import { Component, OnInit } from '@angular/core';
import { Course } from '../models/course.model';
import { User } from '../models/user.model';
import { ClassModel } from '../models/class.model';
import { CourseService } from '../courses/course.service';
import { Router } from '@angular/router';
import { ClassService } from '../classes/class.service';


@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: []
})

export class AdminComponent implements OnInit {

  courses: Course[];
  classes: ClassModel [];
  errorMessage: string;
  courseCount: number;

  constructor( private courseService: CourseService, private classService: ClassService, private router: Router) {

  }
  currentUser = <User> JSON.parse(localStorage.currentUser);

  ngOnInit() {
    this.currentUser = <User> JSON.parse(localStorage.currentUser);
    this.getClasses();
   this.getCourses();

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


  deleteCourse(courseId) {
    // console.log('In the Admin Component: Deleting course #' + courseId);

    this.courseService.deleteCourse(courseId).subscribe(
      data => { // console.log('deleted course: ');
      this.getCourses(); },
      error => this.errorMessage = <any>error );
  }

  deleteClass(classId) {
    this.classService.deleteClass(classId).subscribe(
      data => { // console.log('deleted class: ');
      this.getClasses(); },
      error => this.errorMessage = <any>error );
  }
}
