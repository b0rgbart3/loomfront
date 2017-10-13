import { Injectable, OnInit } from '@angular/core';
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
const AVATAR_IMAGE_URL = 'http://localhost:3100/avatars/';

@Injectable()
export class UserService implements OnInit {
  currentUser: User;
  isLoggedIn = false;
  private highestID;
  private userCount = 0;
  classregistrations: Classregistrationgroup;
  avatar: Avatar;
  avatars: Avatar[];
  users: User[];
  userObjects: Object[];
  errorMessage: string;

  private _usersUrl = 'http://localhost:3100/api/users';
  private _avatarsUrl = 'http://localhost:3100/api/avatars';
  private _userSettingsUrl = 'http://localhost:3100/api/usersettings';
  private _classregistrationsUrl = 'http://localhost:3100/api/classregistrations';

  constructor (private _http: HttpClient) {}

  ngOnInit() {
    // Let's start by building our "User Chart" which is a local / live
    // list of user info combined with avatar filenames and their associated URLs
    // I guess I have to daisy-chain getUsers and getAvatars to make sure I have
    // them both before building the chart.  The way I've done it means that it
    // will always do all three even if an outside component just needs one piece
    // I think I'm ok with that.

    // Apparently this lifecycle hook doesn't work for 'services'.
    console.log ('In user service, ngOnInit');
    this.subscribeToUsers();
    this.subscribeToAvatars();
  }

  subscribeToUsers() {
    this.getUsers().subscribe(
      users =>  {this.users = users;
      },
      error => this.errorMessage = <any>error);
    }

  subscribeToAvatars() {
      this.getAvatars().subscribe(
        avatars =>  {this.avatars = avatars;
          this.buildUserChart();
        },
        error => this.errorMessage = <any>error);
      }

  findMatchingAvatar(avatar, queryID) {
    return avatar.id === queryID;
  }

  // This builds a local Chart of user info + avatarURLs -- still not sure if the shouldn't just all be stored
  // in the user DB instead of having to recreate it all like this. ??
  buildUserChart(): Object[] {
    console.log ('In user service, building User Chart');
    const localUserObjects = [];
    if (this.users && this.avatars) {

      for (let i = 0; i < this.users.length; i++) {
        const aUserObject = { 'id': '', 'firstname' : '', 'lastname' : '', 'username': '', 'email': '', 'avatarURL': ''};
        aUserObject.id = this.users[i].id;
        aUserObject.firstname = this.users[i].firstname;
        aUserObject.lastname = this.users[i].lastname;
        aUserObject.username = this.users[i].username;
        aUserObject.email = this.users[i].email;
        let matchingAvatar = null;
        for (let j = 0; j < this.avatars.length; j++) {
          if (this.avatars[j].id === this.users[i].id) {
            matchingAvatar = this.avatars[j];
          }
        }
        aUserObject.avatarURL = 'http://localhost:3100/avatars/' + this.users[i].id + '/' + matchingAvatar.filename;
        localUserObjects.push(aUserObject);
      }
    }
    console.log('UserObjects: ' + JSON.stringify(localUserObjects));
    this.userObjects = localUserObjects;
    return localUserObjects;
  }

  getAvatar( id ): Observable<Avatar> {

          return this._http.get<Avatar> ( this._avatarsUrl + '?id=' + id )
          .do(data => {
            // console.log( 'found: ' + JSON.stringify(data) );
          return data; })
          .catch (this.handleError);
    }

    getUser( id ): Observable<User[]> {

      return this._http.get<User[]> ( this._usersUrl + '?id=' + id )
      .do(data => {
        // console.log( 'found: ' + JSON.stringify(data) );
      return data; })
      .catch (this.handleError);
    }

    getClassregistrations(): Observable <Classregistrationgroup> {
      return this._http.get <Classregistrationgroup> (this._classregistrationsUrl)
      .do(data => {
        this.classregistrations = data;
      }).catch (this.handleError );
    }

    getAvatars(): Observable<Avatar[]> {
      console.log ('In user service, getting Avatars: ' + this._avatarsUrl);
      return this._http.get<Avatar[]> (this._avatarsUrl).do(data => { console.log('received avatar data');
          this.avatars = data;
       }, err => console.log('Error:')
      )
        .catch( this.handleError );
    }

    getAvatarImage( id, avatar ): string {

      const avatarimage = AVATAR_IMAGE_URL + id + '/' + avatar.filename;
      console.log('In getAvatarImage: ' + JSON.stringify(avatar) );
      return avatarimage;
    }

    getUsers(): Observable<User[]> {
      console.log ('In user service, gettingUsers');
      return this._http.get <User[]> (this._usersUrl)
        // debug the flow of data
        .do(data => {
          console.log('Got Users data.');
          this.users = data;  // store a local copy - even though this method is usually called
                              // from an outside component
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
         }  }
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

