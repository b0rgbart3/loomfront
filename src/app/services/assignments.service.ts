import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
// import { Http, Response, Headers, RequestOptions } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Globals } from '../globals2';


import { Enrollment } from '../models/enrollment.model';
import { UserService } from './user.service';
import { Assignment } from '../models/assignment.model';


@Injectable()
export class AssignmentsService implements OnInit {

    enrollmentCount = 0;
    highestID = 0;
    assignments: Assignment[];
    errorMessage: string;

    constructor (private _http: HttpClient, private globals: Globals, private userService: UserService) {}

    ngOnInit() {
      this.getAssignmentsNow();

    }
    getAssignmentsNow() {
      this.getAssignments().subscribe(
        data => this.assignments = data,
        error => this.errorMessage = <any>error);
    }

    getAssignmentsInClass( classID ): Observable<any> {
      return this._http.get <Assignment[]>(this.globals.assignments +
      '?class_id=' + classID).do(data => data ).catch(this.handleError);
    }

    getAllAssignments(): Observable<any> {
      return this._http.get <Enrollment[]> (this.globals.assignments)
      .do (data => {
        this.assignments = data;   // STORE THE GOD DAM data in memory for fucks holy sake
        return data;

      }).catch( this.handleError );
    }
    // Return the list of instructor assignments for the current user
    getAssignments(): Observable<any> {
      return this._http.get <Enrollment[]> (this.globals.assignments +
         '?user_id=' + this.userService.getCurrentUser().id )
      .do (data => {
       // console.log(' Returning data from the assignments service: ' + JSON.stringify(data));
        return data;
      }).catch( this.handleError );
    }


     postAssignment(assignment): Observable<Enrollment> {

        assignment.id = this.getNextId();
        // console.log('New id =' + classObject.id);
        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/json');

        // if (!this.assignments) { this.assignments = []; }
        // this.assignments.push(assignment);

        return this._http.put(this.globals.assignments + '?id=' + assignment.id, assignment, {headers: myHeaders}).map(
           () => assignment );

      }

      remove(assignment_id) {

        console.log('In the service, calling delete: ' + assignment_id);
        const urlstring = this.globals.assignments + '?id=' + assignment_id;
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
      if (this.assignments && this.assignments.length > 0) {
      for (let i = 0; i < this.assignments.length; i++) {
      const foundID = Number(this.assignments[i].id);
      // console.log('Found ID: ' + foundID);
      if (foundID >= this.highestID) {
        const newHigh = foundID + 1;
        this.highestID = newHigh;
        // console.log('newHigh == ' + newHigh);
      }
    } } else {
      console.log('The ASSIGNMETS SERVICE HAS NO ASSINGMENTS IN ITS GOD DAMN MEMORY!');

      this.highestID = 1; }
  }




}




