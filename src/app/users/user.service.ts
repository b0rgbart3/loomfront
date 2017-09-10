import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { User } from '../models/user.model';
import { HttpHeaders } from '@angular/common/http';


@Injectable()
export class UserService {
  isLoggedIn: boolean = false;

  private _usersUrl = 'http://localhost:3100/users';

  constructor (private _http: HttpClient) {}

    getUsers(): Observable<User[]> {
      return this._http.get <User[]> (this._usersUrl)
        // debug the flow of data
        .do(data => console.log('All: ' + JSON.stringify(data)))
        .catch( this.handleError );
    }

    postUser(userObject: User): Observable<any> {

      let myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

      console.log("In postUser.");
      let body =  JSON.stringify(userObject);

      console.log( 'Posting User: ', body   );
      return this._http.post(this._usersUrl, userObject, {headers: myHeaders} );
    }

    private handleError (error: HttpErrorResponse) {
      console.log( error.message );
      return Observable.throw(error.message);
    }

}

