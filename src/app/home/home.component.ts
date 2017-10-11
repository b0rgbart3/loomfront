import { Component, OnInit, Output } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ClassService } from '../classes/class.service';
import { User } from '../models/user.model';
import { Classregistrationgroup } from '../models/classregistrationgroup.model';
import { Router } from '@angular/router';



@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {

    test: true;
    currentUser: User;
    username: string;
    classObjects: Object[];
    instructorClassObjects: Object[];
    allregs: Classregistrationgroup[];
    regClassIds: string[];
    instructorClassIds: string[];
    errorMessage: string;

    constructor (
        private authenticationService: AuthenticationService,
      private classService: ClassService,
    private _router: Router) {

    }

    ngOnInit() {
        this.test = true;
        this.currentUser = this.authenticationService.getCurrentUser();
        if (this.currentUser) {
        this.username = this.currentUser.username; } else {
            this.username = '';
        }
        this.classObjects = [];
        this.instructorClassObjects = [];

        this.classService
              .getClasses().subscribe(
                classes =>  {
                  this.classObjects = classes;
                  this.classService.getClassRegistrations().subscribe(
                    classregistrations => { this.allregs = classregistrations;
                      this.getRegClasses();
                      this.getInstructorClasses();
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

      getInstructorClasses() {
        this.instructorClassIds = this.classService.getInstructorClassIds(this.currentUser.id);

        console.log(this.instructorClassIds);

        if (this.instructorClassIds) {
           for (let i = 0; i < this.instructorClassIds.length; i++) {
              this.instructorClassObjects[i] = this.classService.getClassFromMemory(this.regClassIds[i] );
           }

           console.log('classes:  ' + JSON.stringify(this.instructorClassObjects));
        }
      }

      goto( queryID ) {
          const queryString = '/classes/' + queryID;
        this._router.navigate( [queryString] );
      }
}
