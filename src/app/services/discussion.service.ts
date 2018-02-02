import { Injectable, OnInit, OnChanges, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import * as io from 'socket.io-client';

import { ClassModel } from '../models/class.model';
import { Thread } from '../models/thread.model';
import { Globals } from '../globals';
import { User } from '../models/user.model';
import { NotificationsService } from '../services/notifications.service';
import { Notification } from '../models/notifications.model';
import { DiscussionSettings } from '../models/discussionsettings.model';

@Injectable()


export class DiscussionService implements OnInit, OnChanges {
    // private _registryUrl = 'http://localhost:3100/api/classregistrations';
    // private _threadsUrl = 'http://localhost:3100/api/threads';
    private classCount = 0;
    private highestID = 0;
    threads: Thread[];
    errorMessage: string;

    public entered: EventEmitter <User>;
    private socket: SocketIOClient.Socket;
    threadAdded: EventEmitter <Thread>;
    threadDeleted: EventEmitter <Thread>;
    userEntered: EventEmitter <Thread>;
    threadUpdated: EventEmitter <Thread>;

    constructor (private _http: HttpClient,
      private notes: NotificationsService,
      private globals: Globals) {
      this.threadAdded = new EventEmitter();
      this.threadDeleted = new EventEmitter();
      this.userEntered = new EventEmitter();
      this.threadUpdated = new EventEmitter();

      this.socket = io(this.globals.basepath);

      // respond to broadcast messages from the chatserver
      this.socket.on('userentering', (data) => {
        // console.log('GOT A THREAD UPDATE');

      // this.sendNotice( {type: 'info', message: [ data.user.username + ' has entered the discussion.' ], delay: 2000} ); 
      this.userEntered.emit(data);

    });

    this.socket.on('updatethread', (data) => {
     // console.log('GOT A THREAD UPDATE');
      this.threadUpdated.emit(data);
    });

      this.socket.on('newthread', (data) => {
       // console.log('New Thread: ' + JSON.stringify( data ) );
        this.threadAdded.emit(data);    });

      this.socket.on('deletethread', (data) => {
       // console.log('Deleting Thread: ' + JSON.stringify( data ) );
        this.threadDeleted.emit(data);   });


    }

    ngOnInit() {
      // this.getThreads().subscribe(
      //   threads => this.threads = threads,
      //   error => this.errorMessage = <any>error);


    }

    ngOnChanges() {

    }

    storeDiscussionSettings( discussionObject ): Observable <any> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');

      console.log('Storing settings: ' + JSON.stringify(discussionObject));
      // return this._http.put <DiscussionSettings> (this.globals.discusssettings, {headers: myHeaders} )
      //  .do (data => { console.log('Got Discussion Settings back from the API' + JSON.stringify(data)); })
      //  .catch ( this.handleError );

       return this._http.put(this.globals.discusssettings, discussionObject,
       {headers: myHeaders}).map( () => console.log('DONE') );


    }
    getDiscussionSettings( user_id, classID, sectionNumber ): Observable <any> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');

      return this._http.get <DiscussionSettings> (this.globals.discusssettings +
          '?user_id=' + user_id + '&classID=' + classID + '&section=' + sectionNumber, {headers: myHeaders} )
      .do (data => {
       //  console.log('Got Discussion Settings back from the API' + JSON.stringify(data));
    })
      .catch ( this.handleError );
    }

    updatehighestID() {
           // Loop through all the Classes to find the highest ID#
           for (let i = 0; i < this.threads.length; i++) {
            const foundID = Number(this.threads[i].id);

            if (foundID >= this.highestID) {
              const newHigh = foundID + 1;
              this.highestID = newHigh;
            }
          }
          if (this.highestID <= 0 ) {
              this.highestID = 1;
          }
    }

   getThreads( classID, sectionNumber ): Observable<any> {
     const myHeaders = new HttpHeaders();
     myHeaders.append('Content-Type', 'application/json');

    return this._http.get <Thread[]> (this.globals.threads + '?classID=' + classID + '&sectionNumber=' +
     sectionNumber, {headers: myHeaders})
      // debug the flow of data
      .do(data => {
       // console.log('All: ' + JSON.stringify(data));

        // Is there any point in keeping a local copy of the threads?
       this.threads = data;

        this.updatehighestID();
     // console.log('Thread\'s highest ID: ' + this.highestID);

    } )
      .catch( this.handleError );
  }



  getThread(id): Observable<any> {
    return this._http.get<Thread[]> ( this.globals.threads + '?id=' + id )
      .do(data => {
        // console.log( JSON.stringify(data));  this.threadAdded.emit( data[0] );
       } )
      .catch (this.handleError);
  }

  deleteThread(thread): Observable<any> {
   // console.log('Deleting thread: ' + JSON.stringify(thread));

    this.socket.emit('deletethread', thread);
    return this._http.delete( this.globals.threads + '?id=' + thread.id);
  }


 newThread(thread): Observable<Thread> {

    thread.id = this.highestID.toString();
    this.highestID++;

    const myHeaders = new HttpHeaders();
    myHeaders.append('Content-Type', 'application/json');

    // Let's Emit to subscribers that we're creating a new thread.
    // this.threadAdded.emit(thread);

    // this.sendNotice( {type: 'info', message: ['Welcome to the discussion, ' + thread ], delay: 2000} );

    this.socket.emit('newthread', thread );

    // Note: I'm using post instead of put - so I can trigger the API to double-check the id#
    // and if it exists already, then determine what it should be

    return this._http.put(this.globals.threads + '?id=' + thread.id, thread,
     {headers: myHeaders}).map( () => thread );

  }

  updateThread(thread): Observable<Thread> {

        this.socket.emit('updatethread', thread );

        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/json');


        // Note: I'm not passing the id as part of the url -- because it's inside the classObject
        const url = this.globals.threads;
        return this._http.put(url + '?id=' + thread.id, thread, {headers: myHeaders}).map( () => thread );

      }

    private handleError (error: HttpErrorResponse) {
    //  console.log('ERROR:');
    //  console.log( error.message );
      return Observable.of(error.message);

    }


    enterDiscussion( user: User , thisClass: ClassModel, sectionNumber: number): Observable <any> {
     // return Observable.of(null);
    //  console.log('entering the discussion: ');

      const enterDiscussionObject = { 'user': user, 'classID': thisClass.id, 'sectionNumber': sectionNumber };
      return this._http.put ( this.globals.enterdiscussion, enterDiscussionObject ).do( data => {
     //   console.log('Got back from the putting of the enterdiscussion api request.');
      }).catch ( this.handleError );
  }

  // return an array of ID's of who's currently in the chatroom

  whosIn( thisClass: ClassModel, sectionNumber: number ): Observable <any> {
      // console.log('Discussion service is requesting whos in the discussion.' + thisClass.id);
      let whosIn = [];
      const whosInObject = { classID: thisClass.id };
      return this._http.get <any[]> ( this.globals.whosin + '?id=' +
        thisClass.id + '&section=' + sectionNumber  ).do( data => {whosIn = data;
     // console.log('got the whosin data: ' + JSON.stringify( data ) );
     }).catch(this.handleError );
  }
  sendNotice(data) {
      this.notes.add( new Notification( data.type, data.message, data.delay ) );

    }

  introduceMyself(user, classID, sectionNumber) {
      this.sendNotice( {type: 'info', message: ['Welcome to the discussion, ' + user.username ], delay: 2000} );

      this.socket.emit('enter', user, classID, sectionNumber);

    }

}




