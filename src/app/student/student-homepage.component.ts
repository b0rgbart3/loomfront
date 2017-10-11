import { Component, OnInit } from '@angular/core';
import { Http} from '@angular/http';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user.model';
import { CourseService } from '../courses/course.service';
import { Course } from '../models/course.model';
import { ClassModel } from '../models/class.model';
import { ClassService } from '../classes/class.service';
import { Classregistrationgroup } from '../models/classregistrationgroup.model';


@Component({
  templateUrl: './student-homepage.component.html',
  styleUrls: ['./student-homepage.component.css']
})
export class StudentHomepageComponent implements OnInit {
  title = 'app';
  currentUser: User;
  classObjects: ClassModel[];
  regClassIds: string[];
  regclasses: ClassModel[];
  errorMessage: string;
  allregs: Classregistrationgroup[];
  test: true;
  username: string;

  constructor (
    private authenticationService: AuthenticationService,
  private classService: ClassService) { }

    ngOnInit() {
      this.test = true;

      // this.username = localStorage.getItem('username');
      this.currentUser = this.authenticationService.getCurrentUser();
      if (this.currentUser) {
      this.username = this.currentUser.username; } else {
          this.username = '';
      }

      this.classObjects = [];

      this.classService
      .getClasses().subscribe(
        classes =>  {
          this.classObjects = classes;
          this.classService.getClassRegistrations().subscribe(
            classregistrations => { this.allregs = classregistrations;
              this.getRegClasses();
            },
            error => this.errorMessage = <any>error);
      },
        error => this.errorMessage = <any>error);

    }

    getRegClasses() {
      this.regClassIds = this.classService.getRegClassIds(this.currentUser.id);

      // console.log(this.regClassIds);

      if (this.regClassIds) {
         for (let i = 0; i < this.regClassIds.length; i++) {
            this.classObjects[i] = this.classService.getClassFromMemory(this.regClassIds[i] );
         }

         console.log('classes:  ' + JSON.stringify(this.classObjects));
      }
    }
}
