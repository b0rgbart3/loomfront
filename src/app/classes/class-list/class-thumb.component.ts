import { Component, OnInit, Input } from '@angular/core';
import { ClassModel } from '../../models/class.model';
import { ClassService } from '../../services/class.service';
import { User } from '../../models/user.model';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { Globals } from '../../globals';
import { AssignmentsService } from '../../services/assignments.service';
import { Assignment } from '../../models/assignment.model';
import { UserService } from '../../services/user.service';
import { Userthumbnail } from '../../models/userthumbnail.model';

@Component({
  selector: 'class-thumb',
  templateUrl: './class-thumb.component.html',
  styleUrls: ['./class-thumb.component.css'],
  providers: [ClassService]
})

export class ClassThumbComponent implements OnInit {

@Input() classObject: ClassModel;
@Input() showTeachers: boolean;
public classImageURL: string;
public courseID: string;
public course: Course;
public courseimageURL: string;
public errorMessage: string;
description: string;
assignments: Assignment[];
instructors: User[];
instructorThumbnails: Userthumbnail[];
showingBio: boolean;
bioChosen: User;

  constructor(private classService: ClassService, private courseService: CourseService, private globals: Globals,
    private assignmentsService: AssignmentsService, private userService: UserService) { }

  ngOnInit() {
    this.showingBio = false;
    this.bioChosen = null;
    this.courseID = this.classObject.course;
    this.assignmentsService.getAssignmentsInClass(this.classObject.id).subscribe(
      assignments => { this.assignments = assignments;
        this.instructors = [];
        for (let i = 0; i < this.assignments.length; i++) {
          this.instructors.push(this.userService.getUserFromMemoryById(this.assignments[i].user_id) );
        }
        this.instructorThumbnails = this.instructors.map( instructor => this.createInstructorThumbnail(instructor));
       // console.log('# of instructors for this class: ' + this.instructorThumbnails.length);
      }
    );
    this.courseService.getCourse(this.courseID).subscribe(
      course =>  {this.course = course[0];
      this.courseimageURL = this.globals.courseimages + '/' + this.courseID + '/' + this.course.image;
      // console.log('this.courseimageURL: ' + this.courseimageURL);
        this.description = this.course.description;
      },
          error => this.errorMessage = <any>error);

  }

  showBio(user) {
    if (!this.showingBio) {
    this.bioChosen = user;
    this.showingBio = true; }
}
closeBio(event) {
    this.showingBio = false;
}
  createInstructorThumbnail(user) {
    const thumbnailObj = { user: user, user_id: user.id, online: false,
        size: 80,  showUsername: true, showInfo: false, textColor: '#ffffff', border: false, shape: 'circle' };
    return thumbnailObj;
}

}
