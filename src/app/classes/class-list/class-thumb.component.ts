import { Component, OnInit, Input } from '@angular/core';
import { ClassModel } from '../../models/class.model';
import { ClassService } from '../class.service';
import { User } from '../../models/user.model';
import { CourseService } from '../../courses/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'class-thumb',
  templateUrl: './class-thumb.component.html',
  styleUrls: ['./class-thumb.component.css'],
  providers: [ClassService]
})

export class ClassThumbComponent implements OnInit {

@Input() classObject: ClassModel;
public classImageURL: string;
public courseID: string;
public course: Course;
public courseimageURL: string;
public errorMessage: string;

  constructor(private classService: ClassService, private courseService: CourseService) { }

  ngOnInit() {
    this.courseID = this.classObject.course;
    this.courseService.getCourse(this.courseID).subscribe(
      course =>  {this.course = course[0];
      this.courseimageURL = 'http://localhost:3100/courseimages/' + this.courseID + '/' + this.course.image;

      },
          error => this.errorMessage = <any>error);

    // this.courseService.getCourseImage().subscribe(
      
    // )
  }

}
