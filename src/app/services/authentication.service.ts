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
    avatarUrl = 'http://localhost:3100/api/avatars';
    public avatar: Avatar;
    public avatarfile: string;
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

        console.log('In authentication service, sending a reset request' + emailObjectString);

        return this.http.post('http://localhost:3100/api/reset', emailObjectString, {headers: myHeaders}).map((response) => {
            // console.log('Got back from http request.');
    });
    }

    loggedInUser(): User {
        this.currentUser = JSON.parse( localStorage.getItem('currentUser') );
        return this.currentUser;
     }

     checkAuthenticationStatus() {
        this.currentUser = JSON.parse( localStorage.getItem('currentUser') );
        console.log('Checking authentication status... ' + JSON.stringify(this.currentUser) );
        const lSvalue = localStorage.getItem('test');
        console.log(lSvalue);
        return this.currentUser;
     }

     doubleCheck() {
        console.log('Double check: '+ this.currentUser.username);
     }

    login(username: string, password: string): Observable <any> {

        this.logout();
        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        const info =  { username: username, password: password };
        
        return this.http.post('http://localhost:3100/api/authenticate', info, {headers: myHeaders} )
            .do((response) => {

                    // localStorage.setItem('username', username );
                    // localStorage.setItem('currentUser', JSON.stringify( response ) );
                    this.currentUser = <User> response;
                    // this.username = this.currentUser.username;
                    localStorage.setItem('currentUser', JSON.stringify( this.currentUser ) );
                    localStorage.setItem('username', username);
                    // console.log('Calling changeNav with: ' + this.currentUser.username);

                    // this.changeNav(this.currentUser.username);
                    // this.loadAvatar();
                   // return JSON.stringify(this.currentUser.username);
                   return <User> response;
                });

    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.username = null;
        this.avatar = null;
        this.avatarfile = null;

    }

    getUserId(): string {
        this.loggedInUser();
        if (this.currentUser) {
          return this.currentUser.id; } else {
            return '';
        }
    }

    getAvatar ( ): Avatar {
        return JSON.parse(localStorage.getItem('currentAvatar') );
      }

    getAvatarfile (): string {
        return localStorage.getItem('currentAvatarfile');
    }

    isloggedin(): boolean {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') );

        if (this.currentUser != null) {
            return true;
        } else { return false; }
    }

    isAdmin(): boolean {
        this.loggedInUser();
        if (this.currentUser.user_type === 'admin') {
            return true;
        }
    }

    loadAvatar () {
        // console.log('Auth Serv: -- getCurrentAvatar()');
        if (this.currentUser) {
            // console.log('currentUser.id' + this.currentUser.id);

            const myHeaders = new HttpHeaders();
            myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

            return this.http.post('http://localhost:3100/api/avatars?id=' + this.currentUser.id, {headers: myHeaders} )
            .map((avatar) => {
                     this.avatar = avatar[0];
                    localStorage.setItem('currentUser', JSON.stringify( avatar ) );
                    this.avatarfile = 'http://localhost:3100/avatars/' + this.currentUser.id + '/' + this.avatar.filename;
                    localStorage.setItem('currentAvatar', JSON.stringify( this.avatar ) );
                    localStorage.setItem('currentAvatarfile', this.avatarfile );

                });



        }
    }

    ngOnInit () {
        this.currentUser = JSON.parse( localStorage.getItem('currentUser') );
    }

}
