import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { FacebookService, LoginResponse, InitParams } from 'ngx-facebook';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class LoomsFacebookService implements OnInit {

initParams: InitParams;
fb_profile: any;
fb_responseObject: any;
fb_statusResponseObject: LoginResponse;
alreadyConnectedThruFB: boolean;
connectedThruFB: boolean;

  constructor (private FB: FacebookService) {

  }

  ngOnInit() {
    /* This app ID is connected with the domain, and a facebook developer id
    For development purposes, this is ddworks.org, via my fb developer account*/
        this.initParams = {
        appId: '143123396316217',
        xfbml: true,
        version: 'v2.11'
      };


      // this.initFB();
  }

  getLoginStatus() {
    this.FB.getLoginStatus()
      .then( response => { this.fb_statusResponseObject = response;
      this.processFBLoginStatusResponse(); } )
      .catch(console.error.bind(console));
  }

/**
 * Get the user's profile from Facebook
 * .
 * This will return the profile if the user is 'logged in-- via facebook',
 * The status will be "connected" / otherwise
 * the status will be "undefined".
 */
  getProfile() {
    this.FB.api('/me')
      .then((res: any) => {this.fb_profile = res;
        if (res) {
          console.log('Got the users profile', res);
        }
      })
      .catch(this.handleError);
  }

  handleError(error) {
    console.log(error);
  }


  processFBLoginStatusResponse() {

         console.log('FACEBOOK Initial Status: ');
         console.log(JSON.stringify(this.fb_statusResponseObject) );

         if (this.fb_statusResponseObject.status === 'connected') {
           this.alreadyConnectedThruFB = true;

           this.getProfile();
         }  else {
           this.connectedThruFB = false;
         }
       }

/**
 * LOGIN -- VIA Facebook
 **
 * If this is the initial login, it establishes the
 * connection between our APP -- and this FB identity
 */

loginWithFacebook(): Promise <any> {
  console.log('checking Login status');
      this.initFB();

    const resolveableLogin = Promise.resolve(
      this.FB.login().then(
        (response: LoginResponse) =>
        console.log(response)).catch((error: any) =>
        console.error(error)) );

      return resolveableLogin;

    }

 /* This calls the Facebook API to get the user's profile -- using the UserID we got in our Response Object.
     The initial response object gives us the user ID - but it doesnt' give us the picture and email, so that's why we're
     calling the API again here. */
     getProfileOfConnectedUser() {
      console.log('Getting the profile for registration purposes.');
      this.FB.api('/' + this.fb_responseObject .authResponse.userID + '?fields=id,name,picture,email')
      .then((res: any) => {this.fb_profile = res;
        console.log('Got the users profile', res);
        console.log('including email: ' + this.fb_profile.email);
       // this.processFBProfile();
      })
      .catch((error: any) => console.error(error));
    }


  initFB() {
    this.FB.init(this.initParams);
    this.getLoginStatus();
  }



}
