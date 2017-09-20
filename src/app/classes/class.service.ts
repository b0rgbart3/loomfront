import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { ClassModel } from '../models/class.model';


@Injectable()
export class ClassService {
    private _classesUrl = 'http://localhost:3100/api/classes';
    private classCount = 0;
    constructor (private _http: HttpClient) {}

   getClasses(): Observable<ClassModel[]> {
    return this._http.get <ClassModel[]> (this._classesUrl)
      // debug the flow of data
      .do(data => console.log('All: ' + JSON.stringify(data)))
      .catch( this.handleError );
  }

  getClass(id): Observable<ClassModel[]> {
    return this._http.get<ClassModel[]> ( this._classesUrl + '/id:' + id )
      .do(data => {
        console.log( 'found: ' + JSON.stringify(data) );
        this.classCount = +data.length;
      return data; })
      .catch (this.handleError);
  }

 createClass(classObject): Observable<ClassModel> {
    const thisID = this.classCount + 1;
    classObject.id = '' + thisID;

    const myHeaders = new HttpHeaders();
    myHeaders.append('Content-Type', 'application/json');

    // Note: I'm not passing the id as part of the url -- because it's inside the classObject
    const url = this._classesUrl + '/create';
    return this._http.put(url, classObject, {headers: myHeaders}).map( () => classObject );

  }

  updateClass(classObject): Observable<ClassModel> {
    console.log('In updateClass, in the service');
    const myHeaders = new HttpHeaders();
    myHeaders.append('Content-Type', 'application/json');

    // Note: I'm not passing the id as part of the url -- because it's inside the classObject
    const url = this._classesUrl + '/update';
    console.log('using this url: ' + url);
    return this._http.put(url, classObject, {headers: myHeaders}).map( () => classObject );

  }


    private handleError (error: HttpErrorResponse) {
      console.log( error.message );
      return Observable.throw(error.message);

    }


}




