import { Injectable, OnChanges } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Avatar } from '../models/avatar.model';

@Injectable()
export class AuthenticationService {
    public token: string;
    public currentUser: User;
    public username;
    avatarUrl = 'http://localhost:3100/api/avatars';
    public avatar: Avatar;
    public avatarfile: string;
    public errorMessage: string;

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
            console.log('Got back from http request.');
    });
    }

    loggedInUser(): User {
        const localUser = localStorage.getItem('currentUser');
        let readInUser = <User> {};
        if (JSON.parse(localUser) ) { readInUser = JSON.parse(localUser); }
        this.currentUser = readInUser;
        return readInUser;
     }

    login(username: string, password: string): Observable <any> {

        console.log('In authentication service, login() method: username:' + username + ', password: ' + password);
        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        const info =  { username: username, password: password };
        console.log('INfo: ' + info);

        // Here we are sending the username and password to the api for authentication.

        return this.http.post('http://localhost:3100/api/authenticate', info, {headers: myHeaders} )
            .map((response) => {
                    localStorage.setItem('currentUser', JSON.stringify( response ) );
                    this.currentUser = <User> response;
                    this.getAvatar(this.currentUser.id).subscribe();
                    // return true to indicate successful login
                    return JSON.stringify(response);
                });

    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }

    getUserId(): string {
        this.loggedInUser();
        return this.currentUser.id;
    }

    getAvatar ( id ): Observable<any> {
         console.log('In authentication service, requesting the avatar object from the api.');
        const getRequest = this.avatarUrl + '?id=' + id;
         console.log('My Get Request: ' + getRequest );
        return this.http.get( getRequest );
      }

    isloggedin(): boolean {
        const user = localStorage.getItem('currentUser');
        if (user != null) {
            return true;
        } else { return false; }
    }

    isAdmin(): boolean {
        this.loggedInUser();
        if (this.currentUser.user_type === 'admin') {
            return true;
        }
    }

    currentAvatar(): Avatar {
        if (this.avatar && this.avatar.id === this.currentUser.id) {
            return this.avatar;
        } else {
            this.getCurrentAvatar();
        }
    }

    getCurrentAvatar () {
        console.log("Auth Serv: -- getCurrentAvatar()");
        if (this.currentUser) {
            console.log('currentUser.id' + this.currentUser.id);
            this.getAvatar(this.currentUser.id).subscribe(
                avatar => {
                    this.avatar = avatar[0];
                    console.log("AS: gCA: " + JSON.stringify(this.avatar));
                    
                    this.avatarfile = 'http://localhost:3100/avatars/' + this.currentUser.id + '/' + this.avatar.filename;
                    console.log("AS: gCA: " + this.avatarfile);
             },
                error => this.errorMessage = <any>error);
        } }

    currentAvatarFile(): string {
        if (this.avatarfile && this.avatar.id === this.currentUser.id) {
            return this.avatarfile;
        } else {
            this.getCurrentAvatar();
        }
    }
}
