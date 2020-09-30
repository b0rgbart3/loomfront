import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
// import { Http, Response, Headers, RequestOptions } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Globals } from '../globals2';


import { Enrollment } from '../models/enrollment.model';
import { UserService } from './user.service';
import { Assignment } from '../models/assignment.model';


@Injectable()
export class EnrollmentsService implements OnInit {

    enrollmentCount = 0;
    highestID = 0;
    enrollments: Enrollment[];
    errorMessage: string;

    constructor (private _http: HttpClient, private globals: Globals, private userService: UserService) {}

    ngOnInit() {
      this.enrollments = [];
      this.getEnrollmentsNow();

    }
    getEnrollmentsNow() {
      this.getEnrollments().subscribe(
        data => this.enrollments = data,
        error => this.errorMessage = <any>error);
    }

    getEnrollmentsInClass( classID ): Observable<any> {
      return this._http.get <Enrollment[]> (this.globals.enrollments + '?class_id=' + classID )
      .do (data => data).catch( this.handleError );
    }
    // Get a list of student ID#s that are in this class.
    // getStudentsInClass( classID ): string[] {
    //   const studentIDList = this.enrollments.map( enrollment =>  {
    //     if ((enrollment.class_id === classID)) {
    //       return enrollment.user_id;
    //     }
    //   });
    //   return studentIDList;
    // }

    getAllEnrollments():  Observable<any> {
      return this._http.get <Enrollment[]> (this.globals.enrollments )
      .do (data => {
        this.enrollments = data;
          return data;
      }).catch( this.handleError );

    }
    // Return the list of student enrollments for the current user
    getEnrollments(): Observable<any> {
      return this._http.get <Enrollment[]> (this.globals.enrollments + '?user_id=' +
       this.userService.getCurrentUser().id )
      .do (data => {
          return data;
      }).catch( this.handleError );

    }

     postEnrollment(enrollment): Observable<Enrollment> {

        enrollment.id = this.getNextId();
        console.log('New id =' + enrollment.id);
        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/json');

        if (!this.enrollments) { this.enrollments = []; }
        this.enrollments.push(enrollment);

        console.log('About to place put request for: ' + JSON.stringify(enrollment));
        return this._http.put(this.globals.enrollments + '?id=0', enrollment, {headers: myHeaders}).map(
           () => enrollment ).catch( this.handleError );

      }

      remove(enrollment_id): Observable<any> {

        // console.log('In the service, calling delete: ' + enrollment_id);
        const urlstring = this.globals.enrollments + '?id=' + enrollment_id;
        // console.log('urlstring: ' + urlstring);
        return this._http.delete(urlstring).do( data => data);
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




