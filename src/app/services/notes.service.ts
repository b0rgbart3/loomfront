import { Injectable, OnInit, OnChanges, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
// import { Http, Response, Headers, RequestOptions } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import * as io from 'socket.io-client';
import { LoomNotificationsService } from './loom.notifications.service';
import { Globals } from '../globals2';
import { NotesSettings } from '../models/notessettings.model';



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  }),
  responseType: 'text'
};

@Injectable()


export class NotesService implements OnInit {



    constructor (private _http: HttpClient,
      private globals: Globals) {

    }

    ngOnInit() {


    }

    getNotesSettings( user_id, class_id, section): Observable <any> {
        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/json');

       // console.log('In the notes Service, getting settings for: user: ' + user_id + ', class: ' +
    //  class_id + ', section: ' + section );

         return this._http.get <NotesSettings> (this.globals.notessettings +
            '?user_id=' + user_id + '&class_id=' + class_id + '&section=' + section, {headers: myHeaders} )
        .do (data => {
          if (data) {
          // console.log('Got Notes Settings back from the API' + JSON.stringify(data));
           return data; } else {
             return new NotesSettings( user_id, class_id, section + '', false, [] );
           }
      })
        .catch ( this.handleError );
      }

      storeNotesSettings( notesSettingsObject ): Observable <any> {
        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/json');
      //  console.log('putting notes settings: ' + JSON.stringify(notesSettingsObject));

        if (!notesSettingsObject.folds) {
            notesSettingsObject.folds = [];
        }
         return this._http.put(this.globals.notessettings, notesSettingsObject,
         {headers: myHeaders}).map( () => console.log('DONE') );


      }

    private handleError (error: HttpErrorResponse) {
        console.log('ERROR:');
        console.log( JSON.stringify(error) );
         return Observable.of(error.message);

       }
}




