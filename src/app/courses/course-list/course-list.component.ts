import { Component, OnInit } from '@angular/core';
import { Course } from '../course';
import { CourseService } from '../course.service';

@Component({
  selector: 'course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'],
  providers: [CourseService]
})

export class CourseListComponent implements OnInit {

  courses = [];
  selectedCourse = {};

  constructor(private courseService: CourseService) { }

  getCourses() {

this.courseService
      .getCourses()
      .then((courses: Course[]) => {
        this.courses = courses.map((course) => {
          return course;
        });
      });

    // this.courseService.getCourses().subscribe(
    //   courses => this.courses = courses);
  }
  ngOnInit() {
     this.getCourses();
   //  this.courseService.getCourses().subscribe(
   //   courses => this.courses = courses);

  }

  private getIndexOfCourse = (courseId: String) => {
    return this.courses.findIndex((course) => {
      return course._id === courseId;
    });
  }

  selectCourse(course: Course) {
    this.selectedCourse = course;
  }

  createNewCourse() {
    let course: Course = {
      title:'', description:'', start:'', length:0
    };

    // By default, a newly-created course will have the selected state.
    this.selectCourse(course);
  }

  deleteCourse = (courseId: String) => {
    let idx = this.getIndexOfCourse(courseId);
    if (idx !== -1) {
      this.courses.splice(idx, 1);
      this.selectCourse(null);
    }
    return this.courses;
  }

  addCourse = (course: Course) => {
    this.courses.push(course);
    this.selectCourse(course);
    return this.courses;
  }

  updateCourse = (course: Course) => {
    let idx = this.getIndexOfCourse(course._id);
    if (idx !== -1) {
      this.courses[idx] = course;
      this.selectCourse(course);
    }
    return this.courses;
  }
}