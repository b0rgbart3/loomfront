import { Component, OnInit } from '@angular/core';
import { Course } from '../models/course.model';
import { CourseService } from '../courses/course.service';

@Component ({
    templateUrl: './course-builder.component.html',
    styleUrls: ['./course-builder.component.css']
})

export class CourseBuilderComponent implements OnInit {

courses: Course[];
courseCount: number;
errorMessage: string;

constructor (
private courseService: CourseService,
) {}

ngOnInit() {
  this.getCourses();
}

getCourses() {
    this.courseService
    .getCourses().subscribe(
      courses =>  {this.courses = courses;
      this.courseCount = this.courses.length; },
      error => this.errorMessage = <any>error);
    }



}
