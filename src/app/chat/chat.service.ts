import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { Course } from '../models/course.model';
import { Material } from '../models/material.model';
import { User } from '../models/user.model';
import { ClassModel } from '../models/class.model';
import { Globals } from '../globals';


@Injectable()
export class ChatService {
    private _chatRegUrl;
    private _chatWhosInUrl;



    constructor (private _http: HttpClient, globals: Globals) {
        this._chatRegUrl = globals.basepath + 'api/chats/enter';
        this._chatWhosInUrl = globals.basepath + 'api/chats/whosin';
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


    private handleError (error: HttpErrorResponse) {
        // console.log( error.message );
        return Observable.throw(error.message);

      }

}




