import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { User } from '../models/user.model';
import { HttpHeaders } from '@angular/common/http';
import { Classregistration } from '../models/classregistration.model';
import { Classregistrationgroup } from '../models/classregistrationgroup.model';

const AVATAR_IMAGE_URL = 'http://localhost:3100/avatars/';

@Injectable()
export class UserService implements OnInit {
  currentUser: User;
  subscribeduser: User;
  isLoggedIn = false;
  private highestID;
  private userCount = 0;
  classregistrations: Classregistrationgroup;
  users: User[];
  errorMessage: string;

  public token: string;
  public username;
  public color: string;

  private _usersUrl = 'http://localhost:3100/api/users';
  private _avatarsUrl = 'http://localhost:3100/api/avatars';
  private _classregistrationsUrl = 'http://localhost:3100/api/classregistrations';

  constructor (private _http: HttpClient) {
    const thisUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = thisUser && thisUser.token;
    this.username = thisUser && thisUser.username;
  }

  ngOnInit() {
    // Let's start by building our "User Chart" which is a local / live
    // list of user info combined with avatar filenames and their associated URLs
    // I guess I have to daisy-chain getUsers and getAvatars to make sure I have
    // them both before building the chart.  The way I've done it means that it
    // will always do all three even if an outside component just needs one piece
    // I think I'm ok with that.

    // Apparently this lifecycle hook doesn't work for 'services'.
    // console.log ('In user service, ngOnInit');
    this.subscribeToUsers();
    this.currentUser = JSON.parse( localStorage.getItem('currentUser') );
  }

  subscribeToUsers() {
    this.getUsers().subscribe(
      users =>  {this.users = users;
      },
      error => this.errorMessage = <any>error);
    }

    subscribeToUser( id ) {
      this.getUser( id ).subscribe(
        user =>  {this.subscribeduser = user[0];
        },
        error => this.errorMessage = <any>error);
      }

  findMatchingAvatar(avatar, queryID) {
    return avatar.id === queryID;
  }

  findUserById(queryId): User {
    let foundUser = <User>{};
    if (this.users) {
    for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].id === queryId) {
            foundUser = this.users[i];
        }
    } }
    return foundUser;
}

    getUser( id ): Observable<User[]> {

      return this._http.get<User[]> ( this._usersUrl + '?id=' + id )
      .do(data => {
        if (data[0].avatar_URL === null) {
          data[0].avatar_URL = AVATAR_IMAGE_URL + 'placeholder.jpg';
          console.log('setting placeholder');
        }
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


    getUsers(): Observable<User[]> {
      // console.log ('In user service, gettingUsers');
      return this._http.get <User[]> (this._usersUrl)
        // debug the flow of data
        .do(data => {
          // console.log('Got Users data.');
          this.users = data;  // store a local copy - even though this method is usually called
                              // from an outside component
          for (let i = 0; i < this.users.length; i++ ) {
            if (this.users[i].avatar_URL === null) {
              console.log('setting placeholder');
              this.users[i].avatar_URL = AVATAR_IMAGE_URL + 'placeholder.jpg';
            }
          }
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
         }
        return this.users;
        }
        )
        .catch( this.handleError );
    }

    getUsersettings(id): Observable<any> {
      return this._http.get( this._usersUrl + '?id=' + id);
    }

    deleteUser(userId: number): Observable<any> {
      return this._http.delete( this._usersUrl + '?id=' + userId);
    }

    createUser(userObject: User): Observable<any> {
      // console.log('Made it to the createUser method.');

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
        return this._http.put(this._usersUrl + '?id=' + settingsObject.id, settingsObject, {headers: myHeaders} );

      }

      sendResetRequest(email: string) {
        const emailObject = {'email': email};
        const emailObjectString = JSON.stringify(emailObject);
        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        // console.log('In authentication service, sending a reset request' + emailObjectString);

        return this._http.post('http://localhost:3100/api/reset', emailObjectString, {headers: myHeaders}).map((response) => {
            // console.log('Got back from http request.');
    });
    }

    loggedInUser(): User {
        // this.currentUser = JSON.parse( localStorage.getItem('currentUser') );
        return this.currentUser;
     }

     checkAuthenticationStatus() {
        // this.currentUser = JSON.parse( localStorage.getItem('currentUser') );
        return this.currentUser;
     }

     getCurrentUser(): User {
         this.currentUser = JSON.parse(localStorage.getItem('currentUser') );
         // this.subscribeToUser(this.currentUser.id);
         return this.currentUser;
     }

     resetCurrentUser( newUserObject ) {
      this.currentUser = newUserObject;
      localStorage.setItem('currentUser', JSON.stringify( newUserObject) );
     }



    login(username: string, password: string): Observable <any> {

        this.logout();
        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        const info =  { username: username, password: password };

        return this._http.post('http://localhost:3100/api/authenticate', info, {headers: myHeaders} )
            .do((response) => {
                    this.currentUser = <User> response;
                    this.username = this.currentUser.username;
                    localStorage.setItem('currentUser', JSON.stringify( this.currentUser ) );
                   return <User> response;
                });

    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentAvatar');
        localStorage.removeItem('currentAvatarfile');
        this.currentUser = null;
        this.username = null;


    }

    getUserId(): string {
      return this.currentUser.id;
    }

    isloggedin(): boolean {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') );

        if (this.currentUser != null) {
            return true;
        } else { return false; }
    }

    isAdmin(): boolean {
        this.loggedInUser();
        if (this.currentUser && this.currentUser.user_type.includes('admin')) {
            return true;
        }
    }



}

