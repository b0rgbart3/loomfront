import { Component, OnInit, Output } from '@angular/core';
import { User } from '../models/user.model';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RouterModule, Routes, NavigationExtras, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { LoomsFacebookService } from '../services/loomsfacebook.service';
import { LoginResponse, FacebookService, InitParams } from 'ngx-facebook';


@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})

export class LoginComponent implements OnInit {

    model = <User> {};
    loading = false;
    error = '';
    message: string;
    fb_responseObject;
    initParams: InitParams;
    fb_statusResponseObject: LoginResponse;
    alreadyConnectedThruFB: boolean;
    connectedThruFB: boolean;
    FBProfile: any;
    newFBUser: User;

    constructor(
        private _flashMessagesService: FlashMessagesService,
        private _router: Router,
        private userService: UserService,
        private FB: FacebookService
         ) { }

    ngOnInit() {
        this.initParams = {
            appId: '143123396316217',
            xfbml: true,
            version: 'v2.11'
          };

    }

    FBLogin() {
        if (this.userService.currentUser) {
            this._router.navigate(['/home']);
        } else {

        this.initFB();
        this.FB.login().then(
            (response: LoginResponse) => {
            console.log(response);
            this.fb_responseObject = response;
            if (this.fb_responseObject.status === 'connected') {
                this.getLoginStatus();
            }
             }
        ).catch((error: any) =>
            console.error(error));
      }
    }

    login() {
        console.log('In login method');
        this.loading = true;

        this.userService.login(this.model.username, this.model.password)
            .subscribe(result => {

                if (result) {
                    const logger = result;

                    console.log('AUTHENTICATED! - : ' + JSON.stringify(logger) );
                    let redirect = '/welcome';


                    if (logger.admin) { redirect = '/admin'; } else {
                        redirect = '/home';
                    }


                // Set our navigation extras object
                // that passes on our global query params and fragment
                // const navigationExtras: NavigationExtras = {
                //   queryParamsHandling: 'preserve',
                //   preserveFragment: true
                // };

                // Redirect the user
                // this.router.navigate([redirect], navigationExtras);
                this._router.navigate([redirect]);
                return;
                } else {
                    console.log('NOT AUTHENTICATED!');
                    this.error = 'Username or password is incorrect';
                    this.loading = false;
                    return;
                }
            },
        err => {
            console.log('NOT AUTHENTICATED!');
            this.error = 'Username or password is incorrect';
            this._flashMessagesService.show('Username or password was incorrect.',
            { cssClass: 'alert-warning', timeout: 7000 });
            this.loading = false;
            return;
        });

}

  initFB() {
    this.FB.init(this.initParams);
    // this.getLoginStatus();
  }
  getLoginStatus() {
    this.FB.getLoginStatus()
      .then( response => { this.fb_statusResponseObject = response;
       this.processFBLoginStatusResponse();
     } )
      .catch(console.error.bind(console));
  }

  processFBLoginStatusResponse() {

         console.log('FACEBOOK Initial Status: ');
         console.log(JSON.stringify(this.fb_statusResponseObject) );

         if (this.fb_statusResponseObject.status === 'connected') {
             console.log('in processFBLoginStatusREsonse: connected === true');
           this.alreadyConnectedThruFB = true;
           this.getProfile();
         }  else {
           this.connectedThruFB = false;
         }
       }

    processFBProfile() {
        this.newFBUser = <User> {};
        const nameSplit = this.FBProfile.name.split(' ');
        if (nameSplit.length === 3 ) {
          this.newFBUser.firstname = nameSplit[0];
          this.newFBUser.middlename = nameSplit[1];
          this.newFBUser.lastname = nameSplit[2];
          this.newFBUser.username = nameSplit[0] + nameSplit[2];
        }
        if (nameSplit.length === 2 ) {
          this.newFBUser.firstname = nameSplit[0];
          this.newFBUser.lastname = nameSplit[1];
          this.newFBUser.username = nameSplit[0] + nameSplit[1];
        }

        this.newFBUser.email = this.FBProfile.email;
        this.newFBUser.facebookRegistration = true;
        this.userService.loginFBUser( this.newFBUser );
        this._router.navigate(['/home']);
    }


    getProfile() {
        console.log('Getting the profile for registration purposes.');
        this.FB.api('/' + this.fb_responseObject.authResponse.userID + '?fields=id,name,picture,email')
        .then((res: any) => {this.FBProfile = res;
          console.log('Got the users profile', res);
          console.log('including email: ' + this.FBProfile.email);

/*        Before we actually "process this profile" & complete the login process, do we need to show this
          user info to the user - so they can make the choice of accepting this Username for their login.
          ??
*/
           this.processFBProfile();
        })
        .catch(this.handleError);
      }
    /**
   * This is a convenience method for the sake of this example project.
   * Do not use this in production, it's better to handle errors separately.
   * @param error
   */
  private handleError(error) {
    console.error('Error processing action', error);
  }
}
