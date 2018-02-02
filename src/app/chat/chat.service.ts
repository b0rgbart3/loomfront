import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import * as io from 'socket.io-client';

import { Course } from '../models/course.model';
import { Material } from '../models/material.model';
import { User } from '../models/user.model';
import { ClassModel } from '../models/class.model';
import { Globals } from '../globals';
import { NotificationsService } from '../services/notifications.service';
import { Notification } from '../models/notifications.model';

@Injectable()
export class ChatService {
    private _chatRegUrl;
    private _chatWhosInUrl;

    private socket: SocketIOClient.Socket; // The client instance of socket.io


    constructor (private _http: HttpClient, 
        private _notes: NotificationsService,
        globals: Globals) {
        
        this.socket = io(globals.basepath);

        this._chatRegUrl = globals.basepath + 'api/chats/enter';
        this._chatWhosInUrl = globals.basepath + 'api/chats/whosin';

        this.socket.on('chatsocketconnect', (data) => {
            console.log(data.hello); // this worked!!!
            // this.sendNotice();
           // this.sendSocketNotice(data);
          });
    }

    enterChat( user: User , thisClass: ClassModel ): Observable <boolean> {
        console.log('entering the chat: ');
        const chatLoginObject = { user: user.id, classID: thisClass.id };
        return this._http.put ( this._chatRegUrl, chatLoginObject ).do( data => {}).catch ( this.handleError );
    }

    // return an array of ID's of who's currently in the chatroom

    whosIn( thisClass: ClassModel): Observable <any> {
        console.log('chat service is requesting whos in the chatroom.' + thisClass.id);
        let whosIn = [];
        const whosInObject = { classID: thisClass.id };
        return this._http.get <any[]> ( this._chatWhosInUrl + '?id=' + thisClass.id  ).do( data => {whosIn = data;
        console.log('got the whosin data: ' + JSON.stringify( data ) ); }).catch(this.handleError );
    }
    sendSocketNotice(data) {
        this._notes.add(<Notification> {type: 'info', message: data});
      }
    
    introduceMyself(user, classID) {
        this.sendSocketNotice( ['Welcome to the chatroom, ' + user.username ]);
        this.socket.emit('enter', user, classID);
      }

    private handleError (error: HttpErrorResponse) {
        // console.log( error.message );
        return Observable.throw(error.message);

      }

}




