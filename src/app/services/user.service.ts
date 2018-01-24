import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { User } from '../models/user.model';
import { HttpHeaders } from '@angular/common/http';
import { Enrollment } from '../models/enrollment.model';
import { Globals } from '../globals';
import { BoardSettings } from '../models/boardsettings.model';


@Injectable()
export class UserService implements OnInit {
  currentUser: User;
  subscribeduser: User;
  private highestID;
  private userCount = 0;
  users: User[];
  errorMessage: string;

  public token: string;
  public username;
  public color: string;

  private base_path;
  private _usersUrl;
  private _avatarsUrl;
  private _classregistrationsUrl;
  private _instructorsUrl;
  private _studentsUrl;
  private _avatar_image_url;
  _userSettingsUrl;

  constructor (private _http: HttpClient, private globals: Globals) {
    const thisUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = thisUser && thisUser.token;
    this.username = thisUser && thisUser.username;

    this.base_path = globals.basepath;
     this._usersUrl = this.base_path + 'api/users';
     this._userSettingsUrl = this.base_path + 'api/usersettings';
     this._avatarsUrl = this.base_path + 'api/avatars';
     this._classregistrationsUrl = this.base_path + 'api/classregistrations';
     this._instructorsUrl = this.base_path + 'api/instructors';
     this._studentsUrl = this.base_path + 'api/students';

     this._avatar_image_url = this.globals.avatars;
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

  findUserByUsername(queryName): User {
    let foundUser = <User>null;

    if (this.users) {
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].username === queryName ) {
          foundUser = this.users[i];
        }
      }
    }

    return foundUser;
  }
  findUserByEmail(queryEmail): User {
    let foundUser = <User>null;
    if (this.users) {
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].email === queryEmail ) {
          foundUser = this.users[i];
        }
      }
    }
    return foundUser;
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
          data[0].avatar_URL = this._avatar_image_url + 'placeholder.jpg';
          // console.log('setting placeholder');
        }
        // console.log( 'found: ' + JSON.stringify(data) );
      return data; })
      .catch (this.handleError);
    }

    // Return an array of Users that are enrolled as instructors for this class ID
    getInstructors( class_id ): Observable <User[]> {
      if (class_id === 0) {
        // Get All the instructors...
        return this._http.get < User[] >( this._instructorsUrl);
      }  else {
        // get a specific instructor
      return this._http.get < User[] >( this._instructorsUrl + '?id=' + class_id);
      }
    }


    getStudents( class_id ): Observable <User[]> {
      return this._http.get < User[] >( this._studentsUrl + '?id=' + class_id);
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
            // If this is not a facebook registration, then let's generate the avatar URL based
            // on the API server
            if (!this.users[i].facebookRegistration) {
              this.users[i].avatar_URL = this._avatar_image_url + this.users[i].id + '/' + this.users[i].avatar_filename;

            if ( (this.users[i].avatar_filename === undefined) || (this.users[i].avatar_filename === '')) {
              // console.log('setting placeholder');
              this.users[i].avatar_URL = this.globals.avatars + 'placeholder.png';
            }
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
         // console.log('Users\'s highest ID: ' + this.highestID);
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
      this.subscribeToUsers();
      console.log('Made it to the createUser method.');

      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
      userObject.id = <string> '' + this.highestID; // toString();
      const body =  JSON.stringify(userObject);
      console.log('Highest ID: ' + this.highestID );
      // console.log('In postUser.');
      // console.log( 'Posting User: ', body   );
      // console.log(this._usersUrl);

      return this._http.put(this._usersUrl + '?id=0', userObject, {headers: myHeaders} );
    }

    updateUser(userObject: User): Observable<any> {
      // console.log('Made it to the updateUser method.');
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
      const body =  JSON.stringify(userObject);
      return this._http.put(this._usersUrl + '?id=' + userObject.id , userObject, {headers: myHeaders} );
    }


    private handleError (error: HttpErrorResponse) {
      // console.log( error.message );
      return Observable.throw(error.message);
    }

    storeBoardSettings( boardSettings: BoardSettings ): Observable<any> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');

      this.currentUser.boardsettings = boardSettings;
      return this._http.put(this._usersUrl + '?id=' + this.currentUser.id, this.currentUser, {headers: myHeaders} );

    }

    saveSettings(settingsObject: any): Observable<any> {
        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/json');
        return this._http.put(this._userSettingsUrl + '?id=' +
            settingsObject.id, settingsObject, {headers: myHeaders, responseType: 'text'} );

      }

      sendResetRequest(email: string) {
        const emailObject = {'email': email};
        const emailObjectString = JSON.stringify(emailObject);
        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        // console.log('In authentication service, sending a reset request' + emailObjectString);

        return this._http.post(this.base_path + '/api/reset', emailObjectString, {headers: myHeaders}).map((response) => {
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

    loginFBUser ( User ) {
      /*  This User object is being sent to this method because we already called the FB api in the
          registration component.  So we are assuming that part of things has already happened.
          We might need another method to login in a user to FB and the loom -- cold, here in the User
          Serivce -- for other components.

          This first uses the local method: findUserByEmail - to check our exiting User array.
          If it doesn't find it -- then it calls the database.
      */

      console.log('IN User Service:, calling find by Email');

       const FBUser = this.findUserByEmail ( User.email );
       if (FBUser !== null) {
        console.log('IN User Service:, found user by Email');
         this.currentUser = <User> FBUser;
         this.username = this.currentUser.username;
         localStorage.setItem('currentUser', JSON.stringify( this.currentUser ));
       } else {
         console.log('In USER SERVICE, in the loginFBUser method, didnt find the user by email');
         this.logout();
         console.log('In USER SERVICE, looking for the user by email: ' + User.email );
         return this.findUserByEmailFromDB( User.email ).subscribe(
           (val) => { this.currentUser = <User> val[0];
               console.log('In USER SERVICE, back from the API: ' + JSON.stringify (val ) );
                      if ( this.currentUser && this.currentUser.username) {
                      this.username = this.currentUser.username;
                      localStorage.setItem('currentUser', JSON.stringify( this.currentUser ));
                    } else { console.log('user not yet signed up.'); }
                     },
           (error) => { this.errorMessage = error; }
         );
       }
    }

    findUserByEmailFromDB( email: string ): Observable <any> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

      return this._http.get(this.base_path + 'api/finduser?email=' + email , {headers: myHeaders} ).do((response) => {
        this.currentUser = <User> response[0];
        this.username = this.currentUser.username;
        console.log('Found username: ' + this.username);
        localStorage.setItem('currentUser', JSON.stringify( this.currentUser ) );
       return <User> response;
      });
    }

    login(username: string, password: string): Observable <any> {

        this.logout();
        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        const info =  { username: username, password: password };

        return this._http.post(this.base_path + 'api/authenticate', info, {headers: myHeaders} )
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
        if (this.currentUser && this.currentUser.admin) {
            return true;
        }
    }



}

