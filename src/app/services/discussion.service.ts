import { Injectable, OnInit, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { ClassModel } from '../models/class.model';
import { Thread } from '../models/thread.model';

@Injectable()
export class DiscussionService implements OnInit, OnChanges {
    private _registryUrl = 'http://localhost:3100/api/classregistrations';
    private _threadsUrl = 'http://localhost:3100/api/threads';
    private classCount = 0;
    private highestID = 0;
    threads: Thread[];
    errorMessage: string;


    constructor (private _http: HttpClient) {}

    ngOnInit() {
      this.getThreads().subscribe(
        threads => this.threads = threads,
        error => this.errorMessage = <any>error);

    }

    ngOnChanges() {

    }

   getThreads(): Observable<Thread[]> {
     const myHeaders = new HttpHeaders();
     myHeaders.append('Content-Type', 'application/json');

    return this._http.get <Thread[]> (this._threadsUrl, {headers: myHeaders})
      // debug the flow of data
      .do(data => {// console.log('All: ' + JSON.stringify(data));
      this.threads = data;
      this.classCount = data.length;

      // Loop through all the Classes to find the highest ID#
      for (let i = 0; i < data.length; i++) {
        const foundID = Number(data[i].id);

        if (foundID >= this.highestID) {
          const newHigh = foundID + 1;
          this.highestID = newHigh;
        }
      }
      if (this.highestID <= 0 ) {
          this.highestID = 1;
      }
      console.log('Thread\'s highest ID: ' + this.highestID);

    } )
      .catch( this.handleError );
  }



  getThread(id): Observable<Thread[]> {
    return this._http.get<Thread[]> ( this._threadsUrl + '?id=' + id )
      .do(data => {

      return data; })
      .catch (this.handleError);
  }

  deleteThread(threadObject): Observable<any> {
    console.log('Deleting thread: ' + JSON.stringify(threadObject));
    return this._http.delete( this._threadsUrl + '?id=' + threadObject.id);
  }


 newThread(threadObject): Observable<Thread> {

    threadObject.id = this.highestID.toString();
    this.highestID++;

    const myHeaders = new HttpHeaders();
    myHeaders.append('Content-Type', 'application/json');

    // Note: I'm not passing the id as part of the url -- because it's inside the classObject
    const url = this._threadsUrl;
    return this._http.put(url + '?id=' + threadObject.id, threadObject,
     {headers: myHeaders}).map( () => threadObject );

  }

  updateThread(threadObject): Observable<Thread> {

        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/json');

        // Note: I'm not passing the id as part of the url -- because it's inside the classObject
        const url = this._threadsUrl;
        return this._http.put(url + '?id=' + threadObject.id, threadObject, {headers: myHeaders}).map( () => threadObject );

      }

    private handleError (error: HttpErrorResponse) {
      console.log( error.message );
      return Observable.throw(error.message);

    }


}




