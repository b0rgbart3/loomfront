import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Globals } from '../globals';


import { Enrollment } from '../models/enrollment.model';
import { UserService } from './user.service';


@Injectable()
export class EnrollmentsService implements OnInit {

    enrollmentCount = 0;
    highestID = 0;
    enrollments: Enrollment[];
    errorMessage: string;

    constructor (private _http: HttpClient, private globals: Globals, private userService: UserService) {}

    ngOnInit() {
      this.getEnrollmentsNow();

    }
    getEnrollmentsNow() {
      this.getEnrollments().subscribe(
        data => this.enrollments = data,
        error => this.errorMessage = <any>error);
    }

    // Get a list of instructor ID#s that are in this class
    getInstructorsInClass( classID): string[] {
      const instructorIDList = this.enrollments.map( enrollment => {
        if ((enrollment.class_id === classID) && (enrollment.participation === 'instructor')) {
          return enrollment.user_id;
        }
      });
      return instructorIDList;
    }
    // Get a list of student ID#s that are in this class.
    getStudentsInClass( classID ): string[] {
      const studentIDList = this.enrollments.map( enrollment =>  {
        if ((enrollment.class_id === classID) && (enrollment.participation === 'student')) {
          return enrollment.user_id;
        }
      });
      return studentIDList;
    }

    getAllInstructorAssignments(): Observable<any> {
      return this._http.get <Enrollment[]> (this.globals.instructorassignments)
      .do (data => {
        return data;
      }).catch( this.handleError );
    }
    // Return the list of instructor assignments for the current user
    getInstructorAssignments(): Observable<any> {
      return this._http.get <Enrollment[]> (this.globals.instructorassignments +
         '?id=' + this.userService.getCurrentUser().id )
      .do (data => {
        console.log(' Returning data from the enrollments service: ' + JSON.stringify(data));
        return data;
      }).catch( this.handleError );
    }

    getAllStudentEnrollments():  Observable<any> {
      return this._http.get <Enrollment[]> (this.globals.studentenrollments )
      .do (data => {
          return data;
      }).catch( this.handleError );

    }
    // Return the list of student enrollments for the current user
    getStudentEnrollments(): Observable<any> {
      return this._http.get <Enrollment[]> (this.globals.studentenrollments + '?id=' +
       this.userService.getCurrentUser().id )
      .do (data => {
          return data;
      }).catch( this.handleError );

    }

    // get the entire list of enrollment objects
   getEnrollments(): Observable<any> {

    return this._http.get <Enrollment[]> (this.globals.enrollments )

      .do(data =>  {
                    this.enrollmentCount = data.length;
                    this.enrollments = data;
                    this.updateIDCount();

                  } )
      .catch( this.handleError );
     }

     postEnrollment(enrollment): Observable<Enrollment> {

        enrollment.id = this.getNextId();
       // console.log('New id =' + classObject.id);
        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/json');

        this.enrollments.push(enrollment);

        return this._http.put(this.globals.enrollments + '?id=' + enrollment.id, enrollment, {headers: myHeaders}).map(
           () => enrollment );

      }

      remove(enrollment_id) {

        console.log('In the service, calling delete: ' + enrollment_id);
        const urlstring = this.globals.enrollments + '?id=' + enrollment_id;
        console.log('urlstring: ' + urlstring);
        return this._http.delete(urlstring);
      }

  getNextId() {

        this.updateIDCount();
        return this.highestID.toString();

  }


  private handleError (error: HttpErrorResponse) {
    console.log('ERROR:');
    console.log( JSON.stringify(error) );
     return Observable.of(error.message);

   }

  updateIDCount() {
      // Loop through all the Materials to find the highest ID#
      if (this.enrollments && this.enrollments.length > 0) {
      for (let i = 0; i < this.enrollments.length; i++) {
      const foundID = Number(this.enrollments[i].id);
      // console.log('Found ID: ' + foundID);
      if (foundID >= this.highestID) {
        const newHigh = foundID + 1;
        this.highestID = newHigh;
        // console.log('newHigh == ' + newHigh);
      }
    } } else { this.highestID = 1; }
  }




}




