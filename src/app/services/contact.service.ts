import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
//import { HttpErrorResponse } from '@angular/common/http';
// import { Http, Response, Headers, RequestOptions } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Globals } from '../globals2';


//import { Enrollment } from '../models/enrollment.model';
import { UserService } from './user.service';
//import { Assignment } from '../models/assignment.model';
import { CFMessage } from '../models/cfmessage.model';


@Injectable()
export class ContactService implements OnInit {

    errorMessage: string;
    highestID: string;
    contactFormMessages: CFMessage[];

    constructor (private _http: HttpClient, private globals: Globals, private userService: UserService) {}

    ngOnInit() {

    }

    sendMsg(msgObject): Observable<any> {

      console.log('Contact service sending message: ' + JSON.stringify(msgObject));
    msgObject.id = this.getHighestID().toString();

    const myHeaders = new HttpHeaders();
    myHeaders.append('Content-Type', 'application/json');

    const url = this.globals.sendCFMsg;
    const putString = url + '?id=' + msgObject.id;

    return this._http.put(putString, msgObject, {headers: myHeaders}).map(
       () => msgObject );
    }

    getHighestID() {

        this.updateIDCount();
        return this.highestID.toString();

  }
    updateIDCount() {
        // Loop through all the CFMessages to find the highest ID#
        if (this.contactFormMessages && this.contactFormMessages.length > 0) {
        for (let i = 0; i < this.contactFormMessages.length; i++) {
        const foundID = Number(this.contactFormMessages[i].id);
        // console.log('Found ID: ' + foundID);
        if (foundID >= +this.highestID) {
          const newHigh = foundID + 1;
          this.highestID = newHigh + '';
          // console.log('newHigh == ' + newHigh);
        }
      } } else { this.highestID = '1'; }
    }

}




