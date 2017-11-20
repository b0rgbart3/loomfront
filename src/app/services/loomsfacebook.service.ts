import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { FacebookService, LoginResponse, InitParams } from 'ngx-facebook';


@Injectable()
export class LoomsFacebookService implements OnInit {

initParams: InitParams;
fb_profile: any;
fb_responseObject: any;

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


/**
 * LOGIN -- VIA Facebook
 **
 * If this is the initial login, it establishes the
 * connection between our APP -- and this FB identity
 */

loginWithFacebook(): void {
  console.log('checking Login status');

      this.FB.login({scope: 'public_profile,email'})
        .then((response: LoginResponse) => {
          this.fb_responseObject = response;
          console.log( 'fb Response: ' + JSON.stringify(response) );
          if (this.fb_responseObject && (this.fb_responseObject.status === 'connected')) {
          // this.getProfileForRegistration();
        }

        })
        .catch((error: any) => console.error(error));

    }




  initFB() {
    this.FB.init(this.initParams);

    // this.getLoginStatus();
  }

}
