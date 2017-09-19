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
    private _coursesUrl = 'http://localhost:3100/api/courses';
    // private _courseSeedUrl = 'http;//localhost:3100/course_seed';

    constructor (private _http: HttpClient) {}

   getCourses(): Observable<Course[]> {
    return this._http.get <Course[]> (this._coursesUrl)
      // debug the flow of data
      .do(data => console.log('All: ' + JSON.stringify(data)))
      .catch( this.handleError );
  }

  //  getCourseSeedID(): Observable<Course[]> {
  //   return this._http.get <any> (this._coursesUrl)
  //     // debug the flow of data
  //     .do(data => console.log('All: ' + JSON.stringify(data)))
  //     .catch( this.handleError );
  // }

  getCourse(id): Observable<Course> {
    return this._http.get<Course> ( this._coursesUrl + '/id:' + id )
      .do(data => {
        console.log( 'found: ' + JSON.stringify(data) );
      return data; })
      .catch (this.handleError);
  }



  postCourse(courseObject: Course): Observable<any> {

          const myHeaders = new HttpHeaders();
          myHeaders.append('Content-Type', 'application/json');

          const body =  JSON.stringify(courseObject);
          console.log( 'Posting User: ', body   );
          return this._http.post(this._coursesUrl + '/add', courseObject, {headers: myHeaders} );
        }



    private handleError (error: HttpErrorResponse) {
      console.log( error.message );
      return Observable.throw(error.message);

    }


}




