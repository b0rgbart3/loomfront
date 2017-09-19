import { Component, OnInit } from '@angular/core';
import { Course } from '../models/course.model';
import { User } from '../models/user.model';
import { Class } from '../models/class.model';
import { CourseService } from '../courses/course.service';


@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: []
})

export class AdminComponent implements OnInit {

  courses: Course[];
  classes: Class [];
  errorMessage: string;

  constructor( private courseService: CourseService) {

  }
  currentUser = <User> JSON.parse(localStorage.currentUser);

  ngOnInit() {
    this.currentUser = <User> JSON.parse(localStorage.currentUser);
    this.courseService
    .getCourses().subscribe(
      courses =>  this.courses = courses,
      error => this.errorMessage = <any>error);
}
}
