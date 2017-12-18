import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Globals } from '../globals';

import { Doc } from '../models/doc.model';
import { MaterialCollection } from '../models/materialcollection.model';


@Injectable()
export class DocService {

    private docCount = 0;
    private highestID = 0;
    private docs: Doc[];

    constructor (private _http: HttpClient, private globals: Globals) {}


   getDocs( doc_id ): Observable<Doc[]> {
     if (doc_id === 0) {
       // get a list of ALL the materials for ALL courses
        return this._http.get <Doc[]> (this.globals.doc).do(data => {
          this.docCount = data.length;
          this.docs = data;
          this.updateIDCount();
        }).catch(this.handleError);
     } else {
    return this._http.get <Doc[]> (this.globals.materials + '?id=' + doc_id )
      // debug the flow of data
      .do(data =>  { // console.log('All: ' + JSON.stringify(data));
                    this.docCount = data.length;
                    this.docs = data;
                    this.updateIDCount();
            // console.log("Course highest ID: "+ this.highestID);
                  } )
      .catch( this.handleError ); }
  }

  getNextId() {
    return this.highestID.toString();
  }

  updateIDCount() {
      // Loop through all the Materials to find the highest ID#
      if (this.docs && this.docs.length > 0) {
      for (let i = 0; i < this.docs.length; i++) {
      const foundID = Number(this.docs[i].id);
      // console.log('Found ID: ' + foundID);
      if (foundID >= this.highestID) {
        const newHigh = foundID + 1;
        this.highestID = newHigh;
        // console.log('newHigh == ' + newHigh);
      }
    } } else { this.highestID = 1; }
  }


  getDoc(id): Observable<Doc> {
    return this._http.get<Doc> ( this.globals.doc + '?id=' + id )
      .do(data => {
         // console.log( 'found: ' + JSON.stringify(data) );
      return data; })
      .catch (this.handleError);
  }

  deleteDoc(docId: string): Observable<any> {
      return this._http.delete( this.globals.doc + '?id=' + docId);
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || {};
  }

  createDoc(docObject: Doc): Observable<any> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
      // let thisID = this.courseCount + 1;
      // console.log('highestID: ' + this.highestID);
      if (this.highestID < 1) {
        this.highestID = 1;
      }
      docObject.id = this.highestID.toString();

      // courseObject.id = '' + thisID;
      const body =  JSON.stringify(docObject);
      // console.log( 'Posting Course: ', body   );
      return this._http.put(this.globals.doc + '?id=' + docObject.id, docObject,
       {headers: myHeaders} );
   }

   updateDoc(docObject: Doc): Observable<any> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
      const body =  JSON.stringify(docObject);
      // console.log( 'Posting Course: ', body   );
      return this._http.put(this.globals.doc + '?id=' + docObject.id, docObject,
        {headers: myHeaders} );
   }

    private handleError (error: HttpErrorResponse) {
      // console.log( error.message );
      return Observable.throw(error.message);

    }



}




