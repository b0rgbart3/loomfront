import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { User } from '../models/user.model';
import { Avatar } from '../models/avatar.model';
import { Usersettings } from '../models/usersettings.model';
import { HttpHeaders } from '@angular/common/http';
import { Classregistration } from '../models/classregistration.model';
import { Classregistrationgroup } from '../models/classregistrationgroup.model';


@Injectable()
export class UserService {
  isLoggedIn = false;
  private highestID;
  private userCount = 0;
  classregistrations: Classregistrationgroup;

  private _usersUrl = 'http://localhost:3100/api/users';
  private _avatarUrl = 'http://localhost:3100/api/avatars';
  private _userSettingsUrl = 'http://localhost:3100/api/usersettings';
  private _classregistrationsUrl = 'http://localhost:3100/api/classregistrations';

  constructor (private _http: HttpClient) {}


    getUser( id ): Observable<User[]> {

      return this._http.get<User[]> ( this._usersUrl + '?id=' + id )
      .do(data => {
        console.log( 'found: ' + JSON.stringify(data) );
      return data; })
      .catch (this.handleError);
    }

    getClassregistrations(): Observable <Classregistrationgroup> {
      return this._http.get <Classregistrationgroup> (this._classregistrationsUrl)
      .do(data => {
        this.classregistrations = data;
      }).catch (this.handleError );
    }

    getUsers(): Observable<User[]> {
      return this._http.get <User[]> (this._usersUrl)
        // debug the flow of data
        .do(data => {
          // console.log('All: ' + JSON.stringify(data));
        this.userCount = data.length;
        // Loop through all the Courses to find the highest ID#
        if (!this.highestID) {
          this.highestID = 0;
        }
        for (let i = 0; i < data.length; i++) {
          const foundID = Number(data[i].id);
          // console.log('Found ID: ' + foundID);
          if (foundID >= this.highestID) {
            const newHigh = foundID + 1;
            this.highestID = newHigh;
            }
          // console.log('hightestID: ' + this.highestID );
         } }

        )
        .catch( this.handleError );
    }

    getUsersettings(id): Observable<any> {
      return this._http.get( this._userSettingsUrl + '?id=' + id);
    }

    deleteUser(userId: number): Observable<any> {
      return this._http.delete( this._usersUrl + '?id=' + userId);
    }

    createUser(userObject: User): Observable<any> {
      console.log('Made it to the createUser method.');

      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
      userObject.id = this.highestID.toString();
      const body =  JSON.stringify(userObject);
      console.log('Highest ID: ' + this.highestID );
      console.log('In postUser.');
      console.log( 'Posting User: ', body   );
      console.log(this._usersUrl);

      return this._http.put(this._usersUrl + '?id=0', userObject, {headers: myHeaders} );
    }

    updateUser(userObject: User): Observable<any> {
      console.log('Made it to the updateUser method.');
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
      const body =  JSON.stringify(userObject);
      return this._http.put(this._usersUrl + '?id=' + userObject.id , userObject, {headers: myHeaders} );
    }


    private handleError (error: HttpErrorResponse) {
      console.log( error.message );
      return Observable.throw(error.message);
    }

    saveSettings(settingsObject: any): Observable<any> {
        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/json');
        return this._http.put(this._userSettingsUrl + '?id=' + settingsObject.id, settingsObject, {headers: myHeaders} );

      }


}

