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

import { HttpParamsOptions } from '@angular/common/http/src/params';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators';
import { Message } from '../models/message.model';
import { Subject } from 'rxjs/Subject';
import { MessageReply } from '../models/messagereply.model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  }),
  responseType: 'text'
};

@Injectable()


export class MessageService implements OnInit {

    messageCount: number;
    messages: Message[];
    errorMessage: string;
    highestID: number;
    msgChanged: EventEmitter <Message>;
    private socket: SocketIOClient.Socket;


    private _message = new Subject<{}>();

    public msgAdded = this._message.asObservable();

    public sendMessage(message: Message) {
      console.log('got request to send a message: ' + JSON.stringify(message));
        this._message.next(message);
    }

    constructor (private _http: HttpClient,
      private notes: NotificationsService,
      private globals: Globals) {
        this.msgChanged = new EventEmitter();
        this.highestID = 1;
        this.socket = io(this.globals.basepath);
        // this.socket.on('msgRplyAdded', (data) => {
        //   this.msgRplyAdded.emit(data);
        // });
        // this.getMessages();
        this.socket.on('messageChanged', (message) => {
          // console.log('GOT A THREAD UPDATE');

        // this.sendNotice( {type: 'info', message: [ data.user.username + ' has entered the discussion.' ], delay: 2000} );
        // this.userEntered.emit(data);
          this.msgChanged.emit(message);
      });
    }

    ngOnInit() {

      // console.log('getting messages');
      // this.getMessages();


    }

    getFreshList(user_id): Observable<any> {
      const userString = '?user_id=' + user_id;
      console.log('getting fresh list for: ' + user_id + ', at: ' + this.globals.freshmessages + '' + userString);

      return this._http.get <Message[]> (this.globals.freshmessages + '' + userString).
      do( data => { console.log('got data back');
          return data; }
        ).catch( this.handleError );
    }
    getMessage(users: string[]): Observable<any> {
      return this._http.get <Message> (this.globals.messages + '?users=' +
       users[0] + ',' + users[1]).
      do( data => data ).catch(
        this.handleError );
    }

    getMessagesForUser(user_id): Observable<any> {
      return this._http.get <Message[]> (this.globals.messages + '?user=' +
       user_id).do( data => data ).catch (this.handleError );
    }

  // get all the messages - so we can keep track of our ID#s
   getMessages(): Observable<any> {

    console.log('getting messages from api...: ' + this.globals.messages);
    return this._http.get <Message[]> (this.globals.messages).do(data =>  { console.log('Got messages from the API.');
      console.log(JSON.stringify(data));
                    this.messageCount = data.length;
                    this.messages = data;
                    this.updateIDCount();


                  } )
      .catch( this.handleError );
     }


     updateIDCount() {
      // Loop through all the Materials to find the highest ID#
      if (this.messages && this.messages.length > 0) {
      for (let i = 0; i < this.messages.length; i++) {
      const foundID = Number(this.messages[i].id);
      // console.log('Found ID: ' + foundID);
      if (foundID >= this.highestID) {
        const newHigh = foundID + 1;
        this.highestID = newHigh;
        // console.log('newHigh == ' + newHigh);
      }
    } } else { this.highestID = 1; }
  }

  makeStale(message): Observable<Message> {
    const myHeaders = new HttpHeaders();
    myHeaders.append('Content-Type', 'application/json');
 

    message.freshness[0].fresh = false;
    message.freshness[1].fresh = false;
    console.log('saving the Message: ' + JSON.stringify(message));

    return this._http.put(this.globals.messages +
       '?id=' + message.id, message, {headers: myHeaders}).map(
       () => {
       return message;
        } );
  }
  saveMessage(message): Observable<Message> {

    const myHeaders = new HttpHeaders();
    myHeaders.append('Content-Type', 'application/json');
    console.log('saving the Message');

    return this._http.put(this.globals.messages + '?id=' + message.id, message, {headers: myHeaders}).map(
       () => {  this.socket.emit('messageChanged', message);
       return message;
        } );

  }


  private handleError (error: HttpErrorResponse) {
    // console.log( error.message );
    return Observable.of(error.message);

  }


}




