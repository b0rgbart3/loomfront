import { Component, OnInit, Input } from '@angular/core';
import { ClassModel } from '../../models/class.model';
import { ClassService } from '../../services/class.service';
import { User } from '../../models/user.model';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { Globals } from '../../globals';

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
description: string;

  constructor(private classService: ClassService, private courseService: CourseService, private globals: Globals) { }

  ngOnInit() {
    this.courseID = this.classObject.course;
    this.courseService.getCourse(this.courseID).subscribe(
      course =>  {this.course = course[0];
      this.courseimageURL = this.globals.courseimages + '/' + this.courseID + '/' + this.course.image;
        this.description = this.course.description;
      },
          error => this.errorMessage = <any>error);

  }

}
