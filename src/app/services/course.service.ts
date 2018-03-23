import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { Course } from '../models/course.model';
import { Material } from '../models/material.model';
import { Globals } from '../globals';


@Injectable()
export class CourseService implements OnInit {
    private courseCount = 0;
    private highestID = 0;
    errorMessage;
    courses: Course[];
    // private _courseSeedUrl = 'http;//localhost:3100/course_seed';

    constructor (private _http: HttpClient, private globals: Globals) {
    }

    ngOnInit() {
      this.getCourses().subscribe(
        courses =>  {this.courses = courses;
        },
        error => this.errorMessage = <any>error);

    }

   getCourses(): Observable<Course[]> {
    return this._http.get <Course[]> (this.globals.courses)
      // debug the flow of data
      .do(data =>  { // console.log('All: ' + JSON.stringify(data));
                    this.courseCount = data.length;
                    this.courses = data;
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


  getCourseFromMemory(queryID): Course {

    if (this.courses) {
      // console.log('looking: ' + this.classes.length);
      for (let i = 0; i < this.courses.length; i++) {

        if (this.courses[i].id === queryID ) {
          return this.courses[i];
        }
      }
    }
    return null;
  }

  getCourse(id): Observable<Course> {
    return this._http.get<Course> ( this.globals.courses + '?id=' + id )
      .do(data => {
        // console.log( 'found: ' + JSON.stringify(data) );
      return data; })
      .catch (this.handleError);
  }

  getCourseImageFromMemory(id) {
    let courseImage = '';

    if (!this.courses) {
      this.getCourses();
    //  console.log('Courses were not yet loaded');
      return null; }

    this.courses.forEach ( function(thecourse)  {
      if (thecourse.id === id) {
        courseImage = thecourse.image;
      }
    });
    return courseImage;
  }

  getCourseImage(id): Observable<string> {
    return this._http.get<string> ( this.globals.courses + '?id=' + id )
      .do(data => {
    //    console.log( 'found: ' + JSON.stringify(data) );
      return data; })
      .catch (this.handleError);
  }

  deleteCourse(courseId: string): Observable<any> {
      return this._http.delete( this.globals.courses + '?id=' + courseId);
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || {};
  }

  createCourse(courseObject: Course): Observable<any> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
        // let thisID = this.courseCount + 1;

      console.log('Creating Course.');

      /* We HAVE to know what the other courses are before we build a new one (so that we can
         assign a proper ID to it. )  -- so if we haven't loaded them in yet, lets fucking do
         it again now.
      */

      if (this.courses) {
            courseObject.id = this.highestID.toString();
            const body =  JSON.stringify(courseObject);
            console.log( 'Posting Course: ', body   );
            return this._http.put(this.globals.courses + '?id=' + courseObject.id,
              courseObject, {headers: myHeaders});
      } else {
        return Observable.of(null);
      }
   }

   updateCourse(courseObject: Course): Observable<any> {

    console.log( 'In course Service: ' + JSON.stringify(courseObject));
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
      const body =  JSON.stringify(courseObject);
      // console.log( 'Posting Course: ', body   );
      return this._http.put(this.globals.courses + '?id=' + courseObject.id, courseObject, {headers: myHeaders} );
   }

    private handleError (error: HttpErrorResponse) {
      // console.log( error.message );
      return Observable.throw(error.message);

    }


}




