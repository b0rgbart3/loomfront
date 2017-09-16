import { Injectable, OnChanges } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable()
export class AuthenticationService {
    public token: string;
    public currentUser: User;
    public username;

    constructor(private http: HttpClient) {
        // set token if saved in local storage
        let thisUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = thisUser && thisUser.token;
        this.username = thisUser && thisUser.username;
    }

    sendResetRequest(email: string) {
        let emailObject = {"email": email};
        let emailObjectString = JSON.stringify(emailObject);
        let myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        console.log("In authentication service, sending a reset request"+ emailObjectString);

        return this.http.post('http://localhost:3100/api/reset', emailObjectString, {headers: myHeaders}).map((response) => {
            console.log("Got back from http request.");
    });
    }

    loggedInUser(): User {
        let localUser = localStorage.getItem('currentUser');
        let readInUser = <User> {};
        if (JSON.parse(localUser) )
        {
            readInUser = JSON.parse(localUser);
        }
        this.currentUser = readInUser;
        return readInUser;  
     }

    login(username: string, password: string): Observable<boolean> {

        console.log('In authentication service, login() method: username:' + username + ", password: "+password);
        let myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        let info =  JSON.stringify({ username: username, password: password });
        console.log("INfo: "+ info);

        // Here we are sending the username and password to the api for authentication.

        return this.http.post('http://localhost:3100/api/authenticate', info, {headers: myHeaders})
            .map((response) => {
                // login successful if there's a jwt token in the response
                //let token = "";

                console.log("Response: " + response);
                let token = response;
                console.log("token: " + token);

                // token = tokenJSON.jwt;
                // console.log("JSON: "+token);

                //let responseJSON = JSON.parse(response.toString());
                //token = response.token;

                if (token) {
                    // set token property
                   // this.token = token;
                    this.username = username;
                    console.log("REASSIGNING USERNAME to: "+username);

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));


                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            }
        );
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }

    isloggedin(): boolean {
        let user = localStorage.getItem('currentUser');
        if (user != null)
        {
            return true;
        }
        else { return false; }
    }
}
