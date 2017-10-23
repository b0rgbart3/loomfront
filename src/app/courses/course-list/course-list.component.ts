import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseService } from '../course.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../../users/user.service';

@Component({
  selector: 'course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'],
  providers: [CourseService]
})

export class CourseListComponent implements OnInit {

  courses: Course[];
  selectedCourse: {};
  errorMessage: string;
  currentUser: User;
  admin: boolean;

  constructor(private courseService: CourseService, private userService: UserService,
    private _router: Router) { }

  ngOnInit() {
     this.currentUser = <User> JSON.parse(localStorage.getItem('currentUser') );
      if ( this.currentUser && this.currentUser.admin ) { this.admin = true; }

      this.courseService
       .getCourses().subscribe(
         courses =>  this.courses = courses,
         error => this.errorMessage = <any>error);

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
   this._router.navigate( ['/course/id:0'] );
  }

  deleteCourse = (courseId: String) => {
    const idx = this.getIndexOfCourse(courseId);
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
    const idx = this.getIndexOfCourse(course._id);
    if (idx !== -1) {
      this.courses[idx] = course;
      this.selectCourse(course);
    }
    return this.courses;
  }
}
