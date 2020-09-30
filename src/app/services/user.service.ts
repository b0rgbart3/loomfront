import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { User } from '../models/user.model';
import { HttpHeaders } from '@angular/common/http';
//import { Enrollment } from '../models/enrollment.model';
import { Globals } from '../globals2';
import { BoardSettings } from '../models/boardsettings.model';
import { Reset } from '../models/reset.model';
import * as io from 'socket.io-client';

/*   Methods in this Service
-------------------------------------
getUserId()
isloggedin()
isAdmin()
logout()
login()
findUserByEmailFromDB()
loginFBUser ()
resetCurrentUser()
getCurrentUser()
checkAuthenticationStatus()
loggedInUser()
resetPassword()
sendResetRequest()
saveSettings()
storeBoardSettings()
handleError()
findUserById()
subscribeToUsers()
subscribeToUser()
findMatchingAvatar()
findUserByUsername()
findUserByEmail()
getUsers()
getStudents()
getInstructors()
getUsersettings()
createUser()
deleteUser()
getInMemoryUsers()
getUserFromMemoryById()
userExists()
uploadAvatar()

-------------------------------------
*/

@Injectable()
export class UserService implements OnInit {
  currentUser: User;
  subscribeduser: User;
  private highestID;
  private userCount = 0;
  users: User[];
  errorMessage: string;
  usersLoaded: boolean;

  public token: string;
  public username;
  public color: string;

  private base_path;
  resetUrl;
  private _avatarsUrl;
  private _classregistrationsUrl;
  private _instructorsUrl;
  private _studentsUrl;
  private _avatar_image_url;
  _userSettingsUrl;
  private socket: SocketIOClient.Socket;
  redirectMsg: string;
  redirectUrl: string;  // This might not be the best place to store this data
                        // but for now, my User Service Singleton is the main
                        // singleton service that is available across the whole app

  constructor (private _http: HttpClient, private globals: Globals) {
    const thisUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = thisUser && thisUser.token;
    this.username = thisUser && thisUser.username;

    this.base_path = globals.basepath;
    // this._usersUrl = this.base_path + 'api/users';
     this._userSettingsUrl = this.base_path + 'api/usersettings';
     this._avatarsUrl = this.base_path + 'api/avatars';
     this._classregistrationsUrl = this.base_path + 'api/classregistrations';
     this._instructorsUrl = this.base_path + 'api/instructors';
     this._studentsUrl = this.base_path + 'api/students';
     this.resetUrl = this.base_path + 'api/reset';

     this._avatar_image_url = this.globals.avatars;
     this.socket = io(this.globals.basepath);
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
    this.usersLoaded = false;
   // this.subscribeToUsers();
    this.currentUser = JSON.parse( localStorage.getItem('currentUser') );
  }

  userExists(id) {
    const userThatExists = this.findUserById(id);
    console.log('User that exists: ' + JSON.stringify(userThatExists));
    if (userThatExists && userThatExists.id === id) {
      console.log('That user really exists.');
      return true;
    } else {
      console.log('That user really doesnt exist.');
      return false; }
  }

  subscribeToUsers() {
    this.getUsers().subscribe(
      users =>  {this.users = users;
        if (this.users && this.users.length > 1) {
          this.usersLoaded = true;
        } else { this.usersLoaded = false; }
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

    console.log('searching for a user with a username of: ' + queryName);
    if (this.users) {
      for (let i = 0; i < this.users.length; i++) {
        console.log(this.users[i].username);
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


getUserFromMemoryById( queryID: string): User {

  // console.log('In getUserFromMemory: user: ' + queryID);

  let foundUser = null;
  if (this.users) {
    foundUser = this.users.find( function( user) { return user.id === queryID; } );
  } else {
   //  console.log('No users in memory.');
  }
//  console.log('done filtering for user.');

  if (foundUser) {
    // console.log('found user: ' + JSON.stringify(foundUser));
     } else {
  //  console.log('USERS: ' + JSON.stringify(this.users));
  }
  return foundUser;
}
    getUser( id: string ): Observable<any> {

      return this._http.get<User> ( this.globals.users + '?id=' + id )
      .do(data => {
        if (data[0].avatar_URL === null) {
          data[0].avatar_URL = this._avatar_image_url + 'placeholder.jpg';
          // console.log('setting placeholder');
        }
        // console.log( 'found: ' + JSON.stringify(data) );
      return data; }).catch( this.handleError );


    }

    getInstructorsForClass(classID): Observable <User[]> {
      return this._http.get <User[]> ( this.globals.assignments + '?class_id=' + classID);
    }

    getAllInstructors(): Observable <User[]> {
      return this._http.get <User[]> ( this.globals.users + '?instructor=true' );
    }


    getStudents( class_id ): Observable <User[]> {
      return this._http.get < User[] >( this._studentsUrl + '?id=' + class_id);
    }

    // This returns the array of current users -- without pinging the database
    getInMemoryUsers(): User[] {
      return this.users;

    }

    getUsers(): Observable<any> {
      // console.log ('In user service, gettingUsers');
      return this._http.get <User[]> (this.globals.users)
        // debug the flow of data
        .do(data => {

          if (typeof data === 'string') {
            // if we got a string back instead of an object  -then it's ACTUALLY an error.
            return data;
          } else {
       //   console.log('Got Users data.');
          this.users = data;  // store a local copy - even though this method is usually called
                              // from an outside component

            for (let i = 0; i < this.users.length; i++) {
              if (!this.users[i].username) {
                // remove bogus data
                this.users.splice(i, 1);
                i--;  // I know this is very dangerous -could cause an infinite loop
                      // but if take this out - then my algorithm only removes one bad object
              }
            }
           for (let i = 0; i < this.users.length; i++ ) {
            // If this is not a facebook registration, then let's generate the avatar URL based
            // on the API server

            if (!this.users[i].facebookRegistration) {
              this.users[i].avatar_URL = this._avatar_image_url + this.users[i].id + '/' + this.users[i].avatar_filename;

            if ( (this.users[i].avatar_filename === undefined) || (this.users[i].avatar_filename === '')) {
              // console.log('setting placeholder');
              this.users[i].avatar_URL = this.globals.avatars + 'placeholder.png';
            }
            }}

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
         if (this.users && this.users.length > 0) {
        return this.users; } else { return null; }
         }
        }
        )
        .catch( this.handleError );
    }

    getUsersettings(id): Observable<any> {
      return this._http.get( this.globals.users + '?id=' + id);
    }

    deleteUser(userId: number): Observable<any> {
      return this._http.delete( this.globals.users + '?id=' + userId);
    }

    createUser(userObject: User): Observable<any> {
      this.subscribeToUsers();
      // console.log('Made it to the createUser method.');

      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
      userObject.id = <string> '' + this.highestID; // toString();
      const body =  JSON.stringify(userObject);
    //  console.log('Highest ID: ' + this.highestID );
      // console.log('In postUser.');
      // console.log( 'Posting User: ', body   );
      // console.log(this._usersUrl);

      // Let's double check to make sure this username or email doesn't already exist
      if (this.findUserByUsername(userObject.username) != null) {
        return Observable.of('We\'re sorry, but an account with that Username already exists.' +
      'Please choose a different Username.');
      } else {

        if (this.findUserByEmail(userObject.email) != null) {
          return Observable.of('We\'re sorry but an account with that Email address already exists.');
        } else {
        return this._http.put(this.globals.users + '?id=0', userObject, {headers: myHeaders} ); }
      }

    }


    updateUser(userObject: User): Observable<any> {
      // console.log('Made it to the updateUser method.');
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
      const body =  JSON.stringify(userObject);
      return this._http.put(this.globals.users + '?id=' + userObject.id , userObject, {headers: myHeaders} );
    }


    private handleError (error: HttpErrorResponse) {
      console.log( error.message );
      return Observable.of(error.message);
    }

    storeBoardSettings( boardSettings: BoardSettings ): Observable<any> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');

      return this._http.put(this.globals.users + '?id=' + this.currentUser.id, this.currentUser, {headers: myHeaders} );

    }

    saveSettings(settingsObject: any): Observable<any> {
        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/json');
        this.socket.emit('userSettingsChanged', settingsObject);
        return this._http.put(this.globals.users + '?id=' +
            settingsObject.id, settingsObject, {headers: myHeaders, responseType: 'text'} ).do(
              data => { localStorage.setItem('currentUser', JSON.stringify( this.currentUser ) ); },
              error => { console.log('error saving settings.'); }
            );

      }

      // uploadAvatar( image ): Observable<any> {
      //   const myHeaders = new HttpHeaders();
      //   myHeaders.append('Content-Type', 'application/json');
      //   console.log('In user service, uploading avatar: ' + JSON.stringify(image));
      //   return this._http.post(this.globals.postavatars + '?id=' + image.id, image.image, {headers: myHeaders } );
      // }
    sendResetRequest(email: string): Observable<any> {
        const emailObject = {'email': email};
        const emailObjectString = JSON.stringify(emailObject);
        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/json');

     //  console.log('In user service, sending a reset request' + emailObjectString);

       return this._http.post(this.base_path + 'api/requestreset', emailObject, {headers: myHeaders})
        .do( data => console.log('Got data back from request reset post') )
        .catch (this.handleError);
    }

    resetPassword( resetObject: Reset ): Observable<any> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');

      return this._http.put(this.resetUrl, resetObject, {headers: myHeaders} );

    }

    loggedInUser(): User {
        // this.currentUser = JSON.parse( localStorage.getItem('currentUser') );
        return this.currentUser;
     }

     unsuspendUser( user: User ) {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');

       user.suspended = false;

       this.updateUser(user).subscribe( data => {}, error => {
         console.log('error suspending user.');
       });
     }

     suspendUser( user: User ) {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');

       user.suspended = true;

       this.updateUser(user).subscribe( data => {}, error => {
         console.log('error suspending user.');
       });
     }

     toggleInstructorStatus( user: User) {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');

      user.instructor = !user.instructor;
      this.updateUser(user).subscribe( data => {}, error => {
        console.log('error making instructor');
      });
    }


    //  makeInstructor( user: User) {
    //    const myHeaders = new HttpHeaders();
    //    myHeaders.append('Content-Type', 'application/json');

    //    user.instructor = true;
    //    this.updateUser(user).subscribe( data => {}, error => {
    //      console.log('error making instructor');
    //    });
    //  }

    //  makeNotInstructor( user: User) {
    //   const myHeaders = new HttpHeaders();
    //   myHeaders.append('Content-Type', 'application/json');

    //   user.instructor = false;
    //   this.updateUser(user).subscribe( data => {}, error => {
    //     console.log('error making instructor');
    //   });
    // }

     checkAuthenticationStatus() {
        // this.currentUser = JSON.parse( localStorage.getItem('currentUser') );
        return this.currentUser;
     }

     getCurrentUser(): User {
         this.currentUser = JSON.parse(localStorage.getItem('currentUser') );
         // this.subscribeToUser(this.currentUser.id);
         return this.currentUser;
     }

    //  getCurrentUser(): Observable <User> {
    //    return Observable.of(this.currentUser);
    //  }

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

   //   console.log('IN User Service:, calling find by Email:' + User.email);

       // const FBUser = this.findUserByEmail ( User.email );
       if (User !== null) {
         this.currentUser = <User> User;
         this.username = this.currentUser.username;
         localStorage.setItem('currentUser', JSON.stringify( this.currentUser ));

         console.log('In User Service, logging in FB user');

         this.findUserByEmailFromDB( User.email ).subscribe(
          (val) => { this.currentUser = <User> val[0];
               console.log('In USER SERVICE, back from the API: ' + JSON.stringify (val ) );
                     if ( this.currentUser && this.currentUser.username) {
                     this.username = this.currentUser.username;
                     localStorage.setItem('currentUser', JSON.stringify( this.currentUser ));
                     this.socket.emit('userChanged', this.currentUser);
                   } else {
                       console.log('user not yet signed up.');
                   }
                    },
          (error) => { this.errorMessage = error; }
        );

       } else {
      console.log('In US / loginFBUser: User==null');
         this.logout();
       //  console.log('In USER SERVICE, looking for the user by email: ' + User.email );
         return this.findUserByEmailFromDB( User.email ).subscribe(
           (val) => { this.currentUser = <User> val[0];
                console.log('In USER SERVICE, back from the API: ' + JSON.stringify (val ) );
                      if ( this.currentUser && this.currentUser.username) {
                      this.username = this.currentUser.username;
                      localStorage.setItem('currentUser', JSON.stringify( this.currentUser ));
                      this.socket.emit('userChanged', this.currentUser);
                    } else {
                        console.log('user not yet signed up.');
                    }
                     },
           (error) => { this.errorMessage = error; }
         );
       }
    }

    findUserByEmailFromDB( email: string ): Observable <any> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

      return this._http.get(this.base_path + '/api/users?email=' + email , {headers: myHeaders} ).do((response) => {
        this.currentUser = <User> response[0];
        this.username = this.currentUser.username;
        console.log('Found username by email: ' + this.username);
        localStorage.setItem('currentUser', JSON.stringify( this.currentUser ) );
       return <User> response[0];
      });
    }

    login(loginObject): Observable <any> {

      console.log('About to login: ');
        this.logout();
        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
        myHeaders.append('Access-Control-Allow-Origin',  this.globals.basepath   );
        myHeaders.append('Access-Control-Allow-Methods', 'GET,PUT,POST,UPDATE,DELETE,OPTIONS');
        myHeaders.append('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

        console.log('With info: ' + JSON.stringify( loginObject ) );

        return this._http.post(this.globals.authenticate, loginObject, {headers: myHeaders})
            .do(response => {

                   console.log('Response: ' + JSON.stringify(response));

                    this.currentUser = <User> response;
                    this.username = this.currentUser.username;
                    localStorage.setItem('currentUser', JSON.stringify( this.currentUser ) );
                    this.socket.emit('userChanged', this.currentUser);
                   return <User> response;
                }).catch( error => {   console.log('ERROR: ' + JSON.stringify( error) ); return Observable.of(error); } );
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


      validateUser( code ): Observable <any> {
        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.get(this.base_path + '/api/users?verificationID=' + code , {headers: myHeaders} ).do(( verifiedUser) => {
          const validatedUser = <User> verifiedUser[0];
          return validatedUser;
      });
    }


}
