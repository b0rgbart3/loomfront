import { Injectable, OnChanges, OnInit, EventEmitter } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Avatar } from '../models/avatar.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class AuthenticationService implements OnInit {
    cartData = new EventEmitter<any>();
    public token: string;
    public currentUser: User;
    public username;
    public errorMessage: string;
    public color: string;


    constructor(private http: HttpClient) {
        // set token if saved in local storage
        const thisUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = thisUser && thisUser.token;
        this.username = thisUser && thisUser.username;

    }

    sendResetRequest(email: string) {
        const emailObject = {'email': email};
        const emailObjectString = JSON.stringify(emailObject);
        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        // console.log('In authentication service, sending a reset request' + emailObjectString);

        return this.http.post('http://localhost:3100/api/reset', emailObjectString, {headers: myHeaders}).map((response) => {
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
         return this.currentUser;
     }



    login(username: string, password: string): Observable <any> {

        this.logout();
        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        const info =  { username: username, password: password };

        return this.http.post('http://localhost:3100/api/authenticate', info, {headers: myHeaders} )
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

    ngOnInit () {

        this.currentUser = JSON.parse( localStorage.getItem('currentUser') );
    }

}
