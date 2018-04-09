import { Component, Input, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { Globals } from '../../globals2';


@Component({
  selector: 'course-image',
  templateUrl: './course-image.component.html',
  styleUrls: ['./course-image.component.css'],
  providers: [CourseService]
})

export class CourseImageComponent implements OnInit {

  @Input() courseID: number;
  course: Course;
  errorMessage: string;
  courseImageURL: string;


  constructor(private courseService: CourseService, private globals: Globals ) { }

  ngOnInit() {
    if (this.courseID && ( this.courseID !== 0 ) ) {
      this.courseService.getCourse(this.courseID).subscribe(
      course => {
          this.course = course[0];
         //  console.log('Loaded course info: ' + JSON.stringify(course));
          // Build the image URL by combining the global path with the stored course id and image name
          this.courseImageURL = this.globals.courseimages + '/' + this.courseID + '/' + this.course.image;

      },
      error => this.errorMessage = <any>error);
    }
  }
}
