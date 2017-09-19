import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseService } from '../course.service';
import { User } from '../../models/user.model';

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



  constructor(private courseService: CourseService) { }

  ngOnInit() {
     this.currentUser = <User> localStorage.currentUser;
      if ( this.currentUser && this.currentUser.user_type === 'admin' ) { this.admin = true; }

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