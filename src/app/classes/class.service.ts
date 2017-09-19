import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { Class } from '../models/class.model';


@Injectable()
export class ClassService {
    private _classesUrl = 'http://localhost:3100/classes';

    constructor (private _http: HttpClient) {}

   getClasses(): Observable<Class[]> {
    return this._http.get <Class[]> (this._classesUrl)
      // debug the flow of data
      .do(data => console.log('All: ' + JSON.stringify(data)))
      .catch( this.handleError );
  }


    private handleError (error: HttpErrorResponse) {
      console.log( error.message );
      return Observable.throw(error.message);

    }


}




