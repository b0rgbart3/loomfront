import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { Material } from '../models/material.model';


@Injectable()
export class MaterialService {
    private _materialsUrl = 'http://localhost:3100/api/materials';
    private materialCount = 0;
    private highestID = 0;
    // private _courseSeedUrl = 'http;//localhost:3100/course_seed';

    constructor (private _http: HttpClient) {}

   getMaterials(): Observable<Material[]> {
    return this._http.get <Material[]> (this._materialsUrl)
      // debug the flow of data
      .do(data =>  { // console.log('All: ' + JSON.stringify(data));
                    this.materialCount = data.length;
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


  getMaterial(id): Observable<Material> {
    return this._http.get<Material> ( this._materialsUrl + '?id=' + id )
      .do(data => {
        // console.log( 'found: ' + JSON.stringify(data) );
      return data; })
      .catch (this.handleError);
  }

  deleteMaterial(courseId: number): Observable<any> {
      return this._http.delete( this._materialsUrl + '?id=' + courseId);
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || {};
  }

  createMaterial(courseObject: Material): Observable<any> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
      // let thisID = this.courseCount + 1;
      if (this.highestID < 1) {
        this.highestID = 1;
      }
      courseObject.id = this.highestID.toString();

      // courseObject.id = '' + thisID;
      const body =  JSON.stringify(courseObject);
      // console.log( 'Posting Course: ', body   );
      return this._http.put(this._materialsUrl + '?id=' + courseObject.id, courseObject, {headers: myHeaders} );
   }

   updateMaterial(courseObject: Material): Observable<any> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
      const body =  JSON.stringify(courseObject);
      // console.log( 'Posting Course: ', body   );
      return this._http.put(this._materialsUrl + '?id=' + courseObject.id, courseObject, {headers: myHeaders} );
   }

    private handleError (error: HttpErrorResponse) {
      // console.log( error.message );
      return Observable.throw(error.message);

    }


}




