import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { Course } from '../models/course.model';
import { Material } from '../models/material.model';


@Injectable()
export class CourseService {
    private _coursesUrl = 'http://localhost:3100/api/courses';
    private _courseImagesUrl = 'http://localhost:3100/api/courseimages';
    private _materialsUrl = 'http://localhost:3100/api/materials';
    private courseCount = 0;
    private highestID = 0;
    // private _courseSeedUrl = 'http;//localhost:3100/course_seed';

    constructor (private _http: HttpClient) {}

   getCourses(): Observable<Course[]> {
    return this._http.get <Course[]> (this._coursesUrl)
      // debug the flow of data
      .do(data =>  { // console.log('All: ' + JSON.stringify(data));
                    this.courseCount = data.length;
            // Loop through all the Courses to find the highest ID#
            for (let i = 0; i < data.length; i++) {
              const foundID = Number(data[i].id);
              // console.log("Found ID: " + foundID);
              if (foundID >= this.highestID) {
                const newHigh = foundID + 1;
                this.highestID = newHigh;
                // console.log("newHigh == "+newHigh);
              }
            }
            // console.log("Course highest ID: "+ this.highestID);
                  } )
      .catch( this.handleError );
  }

  //  getCourseSeedID(): Observable<Course[]> {
  //   return this._http.get <any> (this._coursesUrl)
  //     // debug the flow of data
  //     .do(data => console.log('All: ' + JSON.stringify(data)))
  //     .catch( this.handleError );
  // }

  // loadCourseImage ( queryID ): Observable <any> {
  //   console.log('In LoadCourseImage()');

  //   const myHeaders = new HttpHeaders();
  //   myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  //   return this._http.get('http://localhost:3100/api/courseimages?id=' + queryID, {headers: myHeaders} );
  // }


  getCourse(id): Observable<Course> {
    return this._http.get<Course> ( this._coursesUrl + '?id=' + id )
      .do(data => {
        // console.log( 'found: ' + JSON.stringify(data) );
      return data; })
      .catch (this.handleError);
  }

  getCourseImage(id): Observable<Course> {
    return this._http.get<string> ( this._courseImagesUrl + '?id=' + id )
      .do(data => {
        // console.log( 'found: ' + JSON.stringify(data) );
      return data; })
      .catch (this.handleError);
  }

  deleteCourse(courseId: number): Observable<any> {
      return this._http.delete( this._coursesUrl + '?id=' + courseId);
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || {};
  }

  createCourse(courseObject: Course): Observable<any> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
      // let thisID = this.courseCount + 1;
      courseObject.id = this.highestID.toString();
      // courseObject.id = '' + thisID;
      const body =  JSON.stringify(courseObject);
      // console.log( 'Posting Course: ', body   );
      return this._http.put(this._coursesUrl + '?id=' + courseObject.id, courseObject, {headers: myHeaders} );
   }

   updateCourse(courseObject: Course): Observable<any> {

    console.log( 'In course Service: ' + JSON.stringify(courseObject));
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
      const body =  JSON.stringify(courseObject);
      // console.log( 'Posting Course: ', body   );
      return this._http.put(this._coursesUrl + '?id=' + courseObject.id, courseObject, {headers: myHeaders} );
   }

    private handleError (error: HttpErrorResponse) {
      // console.log( error.message );
      return Observable.throw(error.message);

    }


}




