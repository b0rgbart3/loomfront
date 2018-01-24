import { Component, OnInit, Output } from '@angular/core';
import { User } from '../models/user.model';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RouterModule, Routes, NavigationExtras, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { LoomsFacebookService } from '../services/loomsfacebook.service';
import { LoginResponse, FacebookService, InitParams } from 'ngx-facebook';
import { AlertService } from '../services/alert.service';
import { Globals } from '../globals';


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
    fb_LoginResponseObject;
    initParams: InitParams;
    fb_InitialStatusResponseObject: LoginResponse;
    alreadyConnectedThruFB: boolean;
    connectedThruFB: boolean;
    FBProfile: any;
    newFBUser: User;
    users: User [];
    errorMessage: string;

    constructor(
        private alertService: AlertService,
        private _flashMessagesService: FlashMessagesService,
        private _router: Router,
        private userService: UserService,
        private FB: FacebookService,
        private globals: Globals
         ) { }

    ngOnInit() {
      this.userService.getUsers().subscribe(
        users =>  {this.users = users;
        },
        error => this.errorMessage = <any>error);
      // Yes, we are starting right off the bat with checking the FB login status
      // We are therefore forever linked and connected to the evil empire
      this.initFB();
    }

    keyDownFunction(event) {
      if (event.keyCode === 13) {
       this.login();
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

            const foundUser = this.userService.findUserByUsername(this.model.username);
            if (foundUser) {
              this.error = 'Your Password is incorrect';
            } else {
              this.error = 'We didn\'t find that username in our system.';
            }

            this._flashMessagesService.show(this.error,
            { cssClass: 'alert-warning', timeout: 7000 });
            this.loading = false;
            return;
        });

}


  initFB() {
    this.FB.init(this.globals.fb_app_params);
    this.getInitialLoginStatus();
  }


  getInitialLoginStatus() {
    this.FB.getLoginStatus()
      .then( response => { this.fb_InitialStatusResponseObject = response;
        console.log ('Got Login Status: ' + JSON.stringify(response));
     } )
      .catch(console.error.bind(console));
  }

  // processFBLoginStatusResponse() {

  //        console.log('FACEBOOK Initial Status: ');
  //        console.log(JSON.stringify(this.fb_statusResponseObject) );

  //        // If status is connected, then the user is already connected via facebook, and our app
  //        if (this.fb_statusResponseObject.status === 'connected') {
  //            console.log('in processFBLoginStatusREsonse: connected === true');
  //          this.alreadyConnectedThruFB = true;
  //          // this.getProfileForRegistration();
  //         this.getProfileOfLoggedInUser();
  //         // this.userService.loginFBUser( currentUser );
  //        }  else {
  //           this.FB.login({scope: 'public_profile,email'}).then(
  //           (response: LoginResponse) => {
  //           console.log(response);
  //           this.fb_responseObject = response;
  //           if (this.fb_responseObject.status === 'connected') {
  //               this.getProfileForRegistration();
  //           }
  //            }
  //       ).catch((error: any) =>
  //           console.error(error));
  //        }
  //      }

    processFBProfile() {
      console.log('processing the profile');
        this.newFBUser = <User> {};
        const nameSplit = this.FBProfile.name.split(' ');
        if (nameSplit.length === 3 ) {
          this.newFBUser.firstname = nameSplit[0];
          this.newFBUser.middlename = nameSplit[1];
          this.newFBUser.lastname = nameSplit[2];
          this.newFBUser.username = nameSplit[0] + ' ' + nameSplit[2];
        }
        if (nameSplit.length === 2 ) {
          this.newFBUser.firstname = nameSplit[0];
          this.newFBUser.lastname = nameSplit[1];
          this.newFBUser.username = nameSplit[0] + ' ' + nameSplit[1];
        }

        console.log('user firstname: ' + this.newFBUser.firstname);
        console.log('user lastname: ' + this.newFBUser.lastname);
        this.newFBUser.email = this.FBProfile.email;
        console.log('user email: ' + this.newFBUser.email);
        this.newFBUser.facebookRegistration = true;
        this.newFBUser.avatar_URL = this.FBProfile.picture.data.url;
        console.log('user avatar: ' + JSON.stringify( this.FBProfile.picture) );
        console.log('user avatar url: ' + this.FBProfile.picture.data.url );

        this.registerFBUser( this.newFBUser );

    }
    /* We first search for an existing user with the same email address.
       If it's unique, then we'll go ahead and create a new user.
    */
    registerFBUser( newFBUser: User) {
      console.log('about to signup the user');

              const existingUser = this.userService.findUserByEmail ( newFBUser.email );
              if (existingUser === null) {
                console.log('no user found, so creating one.');
                this.createFBUser(newFBUser);
                this.userService.loginFBUser( newFBUser );
                this._router.navigate(['/home']);
              } else {
                this.userService.loginFBUser( newFBUser );
                this._router.navigate(['/home']);
              }
            }

    createFBUser( newFBUser: User) {
      console.log('About to create a user: ' + JSON.stringify(newFBUser));

                this.userService.createUser( newFBUser ).subscribe(
                  (val) => { console.log('POST call successful value returned in body ', val); },
                  (response) => {console.log('POST call in error', response);
                  this.userService.loginFBUser( newFBUser );
                  this._router.navigate(['/home']);
                },
                  () => {console.log('The POST observable is now completed.');
                    this.alertService.success('Thank you for registering with the Reclaiming Loom. ' +
                      ' Now, please check your email, and use the verification code to verify your account.  Thank you.', true);
                      this._router.navigate(['/welcome']);  });
              }

  getUserInfoFromFB() {
        console.log('Getting the user profile from FB.');
        this.FB.api('/me?fields=id,name,email,picture')
        .then((res: any) => {this.FBProfile = res;
          console.log('Got the users profile, based on the ID: ' +
           this.fb_LoginResponseObject.authResponse.userID + ': ' + JSON.stringify( res ) );
           console.log('including email: ' + this.FBProfile.email);

           if (this.FBProfile.email) {
             // we've got the users email address, so first we need to check out DB to see if this user is registered
             this.processFBProfile();
           }
        })
        .catch(this.handleError);
      }




   StartFBLogin() {
    if (this.userService.currentUser) {
        this._router.navigate(['/home']);
    } else {
      this.FB.login({scope: 'public_profile,email'}).then(
        (response: LoginResponse) => {
        console.log( 'After Login call: the response is: ' + JSON.stringify(response));
        this.fb_LoginResponseObject = response;
        if (this.fb_LoginResponseObject.status === 'connected') {
            this.getUserInfoFromFB();
        }
         }
    ).catch((error: any) =>
        console.error(error));

   }
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
