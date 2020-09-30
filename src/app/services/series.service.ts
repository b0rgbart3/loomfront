import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
// import { Http, Response, Headers, RequestOptions } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Globals } from '../globals2';
import { Series } from '../models/series.model';



@Injectable()
export class SeriesService {

    materialCount = 0;
    highestID = 0;
    series: Series[];
    removedSeries: Series[];
    seriesCount: number;

    constructor (private _http: HttpClient, private globals: Globals) {}


   getSeries( series_id ): Observable<Series[]> {
     if (series_id === 0) {
       // get a list of ALL the series
       console.log('sending get request for series');
        return this._http.get <Series[]> (this.globals.series).do(data => {
          this.seriesCount = data.length;
          this.series = data;
          console.log('Got Data back for Series: ' + JSON.stringify(data));
          this.updateIDCount();
          this.hideRemovals();
        }).catch(this.handleError);
     } else {
    return this._http.get <Series[]> (this.globals.series + '?id=' + series_id )
      // debug the flow of data
      .do(data =>  { // console.log('All: ' + JSON.stringify(data));
                    this.seriesCount = data.length;
                    this.series = data;
                    this.updateIDCount();
            // console.log("Course highest ID: "+ this.highestID);
                  } )
      .catch( this.handleError );
     }

  }

  hideRemovals() {
    // For now I'm just going to remove the class objects that are 'marked for removal'
    // from our main array -- and store them in a separate array
    this.removedSeries = [];
    if (this.series && this.series.length > 0) {
      for (let i = 0; i < this.series.length; i++) {
        if (this.series[i].remove_this) {
          this.removedSeries.push(this.series[i]);
          this.series.splice(i, 1);
        }
      }
    }
  }

  getNextId() {

        this.updateIDCount();
        return this.highestID.toString();

  }

  remove( object: Series): Observable<any> {
    console.log('Got call to remove: ' + JSON.stringify(object));
    object.remove_this = true;
    const myHeaders = new HttpHeaders();
    myHeaders.append('Content-Type', 'application/json');

    return this._http.put(this.globals.series + '?id=' + object.id, object, {headers: myHeaders});

  }

  recoverSeries(seriesObject): Observable <any> {
    seriesObject.remove_this = false;
    return this.updateSeries(seriesObject).do(
      data => {
        // add this course object back into our main array
        this.series.push(data);
        // remove this course object from our list of removed courses
        for (let i = 0; i < this.removedSeries.length; i++) {
          if ( this.removedSeries[i].id === data.id) {
            this.removedSeries.splice(i, 1);
          }
        }

        console.log('recovering course data');
        return data; }   )
      .catch( this.handleError );

  }

  updateIDCount() {
      // Loop through all the Materials to find the highest ID#
      if (this.series && this.series.length > 0) {
      for (let i = 0; i < this.series.length; i++) {
      const foundID = Number(this.series[i].id);
      // console.log('Found ID: ' + foundID);
      if (foundID >= this.highestID) {
        const newHigh = foundID + 1;
        this.highestID = newHigh;
        // console.log('newHigh == ' + newHigh);
      }
    } } else { this.highestID = 1; }
  }



  deleteSeries(id: string): Observable<any> {
      return this._http.delete( this.globals.series + '?id=' + id);
  }

  createSeries(seriesObject: Series): Observable<any> {
      const myHeaders = new HttpHeaders();
      if (this.highestID < 1) {
        this.highestID = 1;
      }
      seriesObject.id = this.highestID.toString();

      // courseObject.id = '' + thisID;
      const body =  JSON.stringify(seriesObject);
      // console.log( 'Posting Course: ', body   );
      return this._http.put(this.globals.series + '?id=' + seriesObject.id, seriesObject, {headers: myHeaders} );
   }

   updateSeries(seriesObject: Series): Observable<any> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
      const body =  JSON.stringify(seriesObject);
      // console.log( 'Posting Course: ', body   );
      return this._http.put(this.globals.series + '?id=' + seriesObject.id, seriesObject, {headers: myHeaders} );
   }

    private handleError (error: HttpErrorResponse) {
      // console.log( error.message );
      return Observable.throw(error.message);

    }



}




