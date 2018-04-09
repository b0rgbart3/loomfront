import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { NgForm, FormControl, FormBuilder,
  FormGroup, FormArray, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FacebookService, InitParams, LoginResponse, LoginStatus } from 'ngx-facebook';
import { BoardSettings } from '../../models/boardsettings.model';
import { Globals } from '../../globals2';
import { AbstractClassPart } from '@angular/compiler/src/output/output_ast';
import { LoomNotificationsService } from '../../services/loom.notifications.service';
import { LoomNotification } from '../../models/loom.notification.model';

// These are my custom validation methods for the signup form
function uniqueUsername( users: User[]): ValidatorFn {
  return (c: AbstractControl): {[key: string]: boolean} | null => {



  if (c.value !== undefined) {
    const foundValue = users.find(obj => obj.username === c.value);
    console.log('Found Value: ' + JSON.stringify(foundValue) );

    if ( foundValue ) {
    return { 'usernameExists': true };
    }

  return null;
  }
};
}

function uniqueEmail( users: User[]): ValidatorFn {
  return (c: AbstractControl): {[key: string]: boolean} | null => {



  if (c.value !== undefined) {
    const foundValue = users.find(obj => obj.email === c.value);
    console.log('Found Value: ' + JSON.stringify(foundValue) );

    if ( foundValue ) {
    return { 'emailExists': true };
    }

  return null;
  }
};
}

@Component({
    moduleId: module.id,
    templateUrl: 'signup.component.html',
    styleUrls: ['signup.component.css']
})

export class SignupComponent implements OnInit {

    startDate = new Date();
    hasPrimaryLanguageError = false;
    date2 = new Date();
    errorMessage: string;
    users;
    user: User;
    currentUser: User;
    admin: boolean;
    editSelf: boolean;
    makeTeacher: boolean;
    isInstructor: boolean;
    checkBox: FormControl;
    regFormGroup: FormGroup;
    regChoice = '';
    fbResponseObject: LoginResponse;
    fbStatusResponseObject: LoginStatus;
    boardSettings: BoardSettings;
    initParams;
    fbloginStatus;
    connectedThruFB: boolean;
    alreadyConnectedThruFB: boolean;
    FBProfile: any;
    newFBUser: User;
    FBUser: any;
    success: boolean;
    emailMessage: string;

    constructor(
      private userService: UserService,
      private router: Router,
      private alertService: AlertService,
      private _flashMessagesService: FlashMessagesService,
      private activated_route: ActivatedRoute,
      private formBuilder: FormBuilder,
      private FB: FacebookService,
      private globals: Globals,
      private _notes: LoomNotificationsService ) {
      }

     private validationMessages = {
       required: 'Please enter your email address.',
       pattern: 'Please enter a valid email address.'
     };

    registerWithFacebook(): void {
      console.log('checking Login status');
      this.regChoice = 'facebook';

      /* This checks the login status -- and if the user is NOT connected to our App via Facebook,
         then it presents the user with a dialog for their login info, which gets verified by FB.
         It then sends us a data-object that includes an "authResponse", object, which has
         an "accessToken", a User_ID, an expiresIn #, and a signedRequest signature.
         If the user IS already connected to our App via facebook, then we just get that same data-object
         back right away, and the dialog box closes itself automatically.
         So we either way we either get a status "connected", otherwise we get a status "unknown" */

          this.FB.login({scope: 'public_profile,email'})
            .then((response: LoginResponse) => {
              this.fbResponseObject = response;
              console.log( 'fb Response: ' + JSON.stringify(response) );
              if (this.fbResponseObject && (this.fbResponseObject.status === 'connected')) {
              this.getProfileForRegistration();
            }

            })
            .catch((error: any) => console.error(error));

        }

  /* This calls the Facebook API to get the user's profile -- using the UserID we got in our Response Object.
     The initial response object gives us the user ID - but it doesnt' give us the picture and email, so that's why we're
     calling the API again here. */
  getProfileForRegistration() {
    console.log('Getting the profile for registration purposes.');
    this.FB.api('/' + this.fbResponseObject.authResponse.userID + '?fields=id,name,picture,email')
    .then((res: any) => {this.FBProfile = res;
      console.log('Got the users profile', res);
      console.log('including email: ' + this.FBProfile.email);
      this.processFBProfile();
    })
    .catch(this.handleError);
  }


  /**
   * Get the user's profile
   */
  getProfile() {
    this.FB.api('/me')
      .then((res: any) => {this.FBProfile = res;
        if (res) {
          this.connectedThruFB = true;
        }
        console.log('Got the users profile', res);
      })
      .catch(this.handleError);
  }

    ngOnInit() {

      this.success = false;
      this.connectedThruFB = false;
      const id = this.activated_route.snapshot.params['id'];
      if (id) {
              this.user = this.activated_route.snapshot.data['user'][0]; }
      this.users = this.activated_route.snapshot.data['users'];

      if (this.user && this.user.instructor) {
        this.isInstructor = true;
      }



      this.admin = false;
      this.editSelf = false;
      this.currentUser = this.userService.getCurrentUser();
      // if (this.user && this.user.id && (this.currentUser.id === this.user.id)) {
      //   this.editSelf = true;
      // }
      if (this.currentUser && this.currentUser.admin) {
        this.admin = true;
      }

      if (!this.user) {
        this.boardSettings = new BoardSettings('', '', '');
        this.user = <User> {};
       // this.user.boardsettings = this.boardSettings;
      }
      this.regFormGroup = this.formBuilder.group( {
        firstname: [this.user.firstname, [ Validators.required, Validators.maxLength(20), ] ],
        lastname: [this.user.lastname, [ Validators.required, Validators.maxLength(40)] ],
        email: [this.user.email, [ Validators.required,
          Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}'),
        uniqueEmail(this.users)] ],
        username: [this.user.username, [ Validators.required, uniqueUsername( this.users ) ]],
        password: [ this.user.password, [ Validators.required,
          Validators.pattern('^(?=.*?[0-9]).{6,}$')]],
        instructor: this.user.instructor,
        admin: this.user.admin
      });

      // Original Pattern:  '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'

      this.alreadyConnectedThruFB = false;
     // this.initFB();
     // this.loginWithFacebook();

     const emailControl = this.regFormGroup.get('email');
     emailControl.valueChanges.subscribe(value =>
      this.setMessage(emailControl));
    }

    setMessage(c: AbstractControl): void {

      if (this.regFormGroup.get('email').touched && this.regFormGroup.get('email').dirty) {
        this.emailMessage = '';
      if (this.regFormGroup.get('email').errors) {

      if (this.regFormGroup.get('email').errors.required) {
        this.emailMessage = 'Please include an email address.';
      }
      if (this.regFormGroup.get('email').errors.pattern) {
        this.emailMessage = 'Please include a valid email address.';
      }
      }
      }
    }
    // Here the user has finished clicking on the Login with Facebook Button
    // and filling in their FB credentials into the FB generated Popup.
    // So we now need to take their login info and "create a registration".
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
        if (this.FBProfile.picture && this.FBProfile.picture.data &&
        this.FBProfile.picture.data.url) {
          this.newFBUser.avatar_URL = this.FBProfile.picture.data.url;
        }
        this.newFBUser.facebookRegistration = true;
        this.registerFBUser( this.newFBUser );


    }

    processFBLoginStatusResponse() {

      console.log('FACEBOOK Initial Status: ');
      console.log(JSON.stringify(this.fbStatusResponseObject) );

      if (this.fbStatusResponseObject.status === 'connected') {
        this.alreadyConnectedThruFB = true;
        this.regChoice = null;
        this.getProfile();
      }  else {
        this.connectedThruFB = false;
      }
    }

    revealForm() {
      this.regChoice = 'direct';
    }
    fblogout() {
      this.FB.logout();
    }

    revealFB() {
      this.regChoice = 'facebook';
      // this.loginWithFacebook();
    }

    already() {
      this.router.navigate(['/login']);
    }

    getLoginStatus() {
      this.FB.getLoginStatus()
        .then( response => { this.fbStatusResponseObject = response;
        this.processFBLoginStatusResponse(); } )
        .catch(console.error.bind(console));
    }

    initFB() {
      this.FB.init(this.globals.fb_app_params);
      this.getLoginStatus();
    }
    // The user filled out and submitted the Registration form.

    cancel() {
      this.router.navigate(['/welcome']);
    }

    /* We first search for an existing user with the same email address.
       If it's unique, then we'll go ahead and create a new user.
    */
    registerFBUser( newFBUser: User) {

      const existingUser = this.userService.findUserByEmail ( newFBUser.email );
      if (existingUser === null) {
        this.createFBUser(newFBUser);
      }
    }

    createFBUser( newFBUser: User) {
      this.userService.createUser( newFBUser ).subscribe(
        (val) => { console.log('POST call successful value returned in body ', val);
          this.userService.loginFBUser( newFBUser );
          this.router.navigate(['/welcome']); },
        response => {console.log('POST call in error', response); },
        () => {console.log('The POST observable is now completed.');
          this.alertService.success('Thank you for registering with the Reclaiming Loom. ' +
            ' Now, please check your email, and use the verification code to verify your account.  Thank you.', true);
            this.router.navigate(['/welcome']);  });
    }

    signupUser() {
      console.log('About to signup user');
      if (this.regFormGroup.dirty && this.regFormGroup.valid) {
        console.log('Form is valid.');
                    // This is Deborah Korata's way of merging our data model with the form model
                     const combinedObject = Object.assign( {}, this.user, this.regFormGroup.value);

        if (this.user.id === '0' || this.user.id === undefined) {

          console.log('About to create a new user');

        this.userService.createUser( combinedObject ).subscribe(
          (val) => { console.log('POST call successful value returned in body ', val);
          // if (val) {
          //   this._flashMessagesService.show(JSON.stringify(val),
          //   { cssClass: 'alert-error', timeout: 18000 });
          //   console.log('Received a return value of: ' + val);
          // } else {
          //   this.success = true;
          //   this._flashMessagesService.show('Thank you for signing up with the Reclaiming Loom.' +
          // ' Now, please check your email, and use the verification code to verify your account. Thank you.',
          //   { cssClass: 'alert-success', timeout: 18000 });
          // }
          this._notes.add(new LoomNotification('success', ['Welcome to the ReclaimingLoom, ' +
          this.regFormGroup.get('username').value + '!',
          'Now you can login using the credentials you just created.'], 10000));
            // this.router.navigate(['/welcome']);
           },
          response => {console.log('POST call in error', response); },
          () => {

          console.log('The POST observable is now completed.');

               this.router.navigate(['/login']);
             });
        } else {
          this.userService
          .updateUser( combinedObject ).subscribe(
          (val) => {
            console.log('POST call successful value returned in body ', val);
          },
          response => {
            console.log('POST call in error', response);
          },
          () => {
            console.log('The POST observable is now completed.');

            if (this.userService.isAdmin() ) {
              this.router.navigate(['/admin']);
            } else {
              this.alertService.success('Your account info has been updated.', true);

              this.router.navigate(['/welcome']);
              }
            }
          );
        }
    }else {
      console.log(this.regFormGroup.get('password').valid);
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


