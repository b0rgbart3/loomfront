import { Injectable } from '@angular/core';

import { User } from './user';
// import { Http, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { HttpErrorResponse } from '@angular/common/http';
// import 'rxjs/add/operator/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';



@Injectable()
export class UserService {
  isLoggedIn: boolean = false;

  private _usersUrl = 'http://localhost:3100/users';

    constructor (private _http: HttpClient) {}

    // getCourses() {
    //   return this.http.get(this.coursesUrl)
    //   .map((response: Response) => <Course []>response.json().data)
    //   .do(data=>console.log(data))
    //   .catch( this.handleErrorTwo );
    // }

    getUsers(): Observable<User[]> {
      return this._http.get <User[]> (this._usersUrl)
        // debug the flow of data
        .do(data => console.log('All: ' + JSON.stringify(data)))
        .catch( this.handleError );
    }
    // }
   // get("/api/courses")
    // getUsers(): Promise<void | User[]> {
    //   return this.http.get(this.usersUrl)
    //              .toPromise()
    //              .then(response => response.json() as User[])
    //              .catch(this.handleError);
    // }

    // post("/api/courses")
    // createUser(newUser: User): Promise<void | User> {
    //   return this.http.post(this.usersUrl, newUser)
    //              .toPromise()
    //              .then(response => response.json() as User)
    //              .catch(this.handleError);
    // }

    // // get("/api/courses/:id") endpoint not used by Angular app

    // // delete("/api/courses/:id")
    // deleteUser(delUserId: String): Promise<void | String> {
    //   return this.http.delete(this.usersUrl + '/' + delUserId)
    //              .toPromise()
    //              .then(response => response.json() as String)
    //              .catch(this.handleError);
    // }

    // // put("/api/courses/:id")
    // updateUser(putUser: User): Promise<void | User> {
    //   var putUrl = this.usersUrl + '/' + putUser._id;
    //   return this.http.put(putUrl, putUser)
    //              .toPromise()
    //              .then(response => response.json() as User)
    //              .catch(this.handleError);
    // }

    private handleError (error: HttpErrorResponse) {
      console.log( error.message );
      return Observable.throw(error.message);
      // let errMsg = (error.message) ? error.message :
      // error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      // console.error(errMsg); // log to console instead
    }

    // private handleErrorTwo (error: Response) {
    //   let msg=`Status code ${error.status} on url ${error.url}`;
    //   console.error(msg);
    //   return Observable.throw(msg);
    // }



}

