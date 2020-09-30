import { Injectable, OnInit, OnChanges, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
// import { Http, Response, Headers, RequestOptions } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import * as io from 'socket.io-client';
import { LoomNotificationsService } from './loom.notifications.service';
import { Globals } from '../globals2';
import { Announcements } from '../models/announcements.model';



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  }),
  responseType: 'text'
};

@Injectable()


export class AnnouncementsService implements OnInit {

    announcementsCount = 0;
    highestID = 0;
    announcements: Announcements[];
    errorMessage: string;
    announcementsLoaded: boolean;

    constructor (private _http: HttpClient,
      private globals: Globals) {

    }

    ngOnInit() {
     console.log('Initializing the Announcements Service');
  }

  getAllAnnouncements(): Observable<any> {
    return this._http.get <Announcements[]> (this.globals.announcements).do(data => {
      this.announcementsCount = data.length;
      this.announcements = data;
      console.log('Got All announcements: ' + JSON.stringify(data));
      this.updateIDCount();
      return data;
    }).catch(this.handleError);
  }

    getObject( id ): Observable<any> {

        if (id === 0) {
          // get a list of ALL the announcements
          console.log('sending get request for announcements');
           return this._http.get <Announcements[]> (this.globals.announcements).do(data => {
             this.announcementsCount = data.length;
             this.announcements = data;
             console.log('Got Data back for all announcements: ' + JSON.stringify(data));
             this.updateIDCount();
             return data;
           }).catch(this.handleError);
        } else {
       return this._http.get <Announcements[]> (this.globals.announcements + '?id=' + id )
         // debug the flow of data
         .do(data =>  { // console.log('All: ' + JSON.stringify(data));
                       const newAnnouncement = data[0];
                       this.announcements.push(newAnnouncement);
                       this.updateIDCount();
                       return data[0];
               // console.log("Course highest ID: "+ this.highestID);
                     } )
         .catch( this.handleError);
        }

     }

     getObjects( class_id ): Observable<any> {

     return this._http.get <Announcements[]> (this.globals.announcements + '?class_id=' + class_id )
       // debug the flow of data
       .do(data => data )
       .catch( this.handleError);

   }


     getNextId() {

          this.updateIDCount();
           return this.highestID;

     }


     updateIDCount() {
         // Loop through all the Materials to find the highest ID#
         console.log('upading IDCount');
         if (this.announcements && this.announcements.length > 0) {
         for (let i = 0; i < this.announcements.length; i++) {
         const foundID = Number(this.announcements[i].id);
          console.log('Found ID: ' + foundID);
         if (foundID >= this.highestID) {
           const newHigh = foundID + 1;
           this.highestID = newHigh;
            console.log('newHigh == ' + newHigh);
         }
       } } else { this.highestID = 1;

      }
     }

     delete(id: string): Observable<any> {
       console.log('requestion deletion');
         return this._http.delete( this.globals.announcements + '?id=' + id);
     }

     create(announcementsObject: Announcements): Observable<any> {

         const myHeaders = new HttpHeaders();
         this.updateIDCount();
         if (this.highestID < 1) {
           this.highestID = 1;
         }

         announcementsObject.id = this.highestID + '';
         console.log('creating announcement object: ' + announcementsObject.id);

         // courseObject.id = '' + thisID;
         const body =  JSON.stringify(announcementsObject);
         // console.log( 'Posting Course: ', body   );
         return this._http.put(this.globals.announcements + '?id=' + announcementsObject.id, announcementsObject, {headers: myHeaders} );
      }

      update(announcementsObject: Announcements): Observable<any> {

         const myHeaders = new HttpHeaders();
         myHeaders.append('Content-Type', 'application/json');
         const body =  JSON.stringify(announcementsObject);
         // console.log( 'Posting Course: ', body   );
         return this._http.put(this.globals.announcements + '?id=' + announcementsObject.id, announcementsObject, {headers: myHeaders} );
      }


    private handleError (error: HttpErrorResponse) {
        console.log('ERROR:');
        console.log( JSON.stringify(error) );
         return Observable.of(error.message);

       }
}




