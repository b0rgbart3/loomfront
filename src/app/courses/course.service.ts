import { Injectable } from '@angular/core';
import { Course } from './course';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// import 'rxjs/add/operator/toPromise';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';

@Injectable()
export class CourseService {
    private coursesUrl = '/api/courses';

    constructor (private http: Http) {}

    // getCourses() {
    //   return this.http.get(this.coursesUrl)
    //   .map((response: Response) => <Course []>response.json().data)
    //   .do(data=>console.log(data))
    //   .catch( this.handleErrorTwo );
    // }
    // }
   // get("/api/courses")
    getCourses(): Promise<void | Course[]> {
      return this.http.get(this.coursesUrl)
                 .toPromise()
                 .then(response => response.json() as Course[])
                 .catch(this.handleError);
    }

    // post("/api/courses")
    createCourse(newCourse: Course): Promise<void | Course> {
      return this.http.post(this.coursesUrl, newCourse)
                 .toPromise()
                 .then(response => response.json() as Course)
                 .catch(this.handleError);
    }

    // get("/api/courses/:id") endpoint not used by Angular app

    // delete("/api/courses/:id")
    deleteCourse(delCourseId: String): Promise<void | String> {
      return this.http.delete(this.coursesUrl + '/' + delCourseId)
                 .toPromise()
                 .then(response => response.json() as String)
                 .catch(this.handleError);
    }

    // put("/api/courses/:id")
    updateCourse(putCourse: Course): Promise<void | Course> {
      var putUrl = this.coursesUrl + '/' + putCourse._id;
      return this.http.put(putUrl, putCourse)
                 .toPromise()
                 .then(response => response.json() as Course)
                 .catch(this.handleError);
    }

    private handleError (error: any) {
      let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    }

    // private handleErrorTwo (error: Response) {
    //   let msg=`Status code ${error.status} on url ${error.url}`;
    //   console.error(msg);
    //   return Observable.throw(msg);
    // }
    

}




