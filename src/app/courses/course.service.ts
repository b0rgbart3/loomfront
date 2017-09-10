import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { Course } from '../models/course.model';


@Injectable()
export class CourseService {
    private _coursesUrl = 'http://localhost:3100/courses';

    constructor (private _http: HttpClient) {}

   getCourses(): Observable<Course[]> {
    return this._http.get <Course[]> (this._coursesUrl)
      // debug the flow of data
      .do(data => console.log('All: ' + JSON.stringify(data)))
      .catch( this.handleError );
  }


    private handleError (error: HttpErrorResponse) {
      console.log( error.message );
      return Observable.throw(error.message);

    }


}




