import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user.model';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RouterModule, Routes, NavigationExtras, Router } from '@angular/router';


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

    constructor(
        private authenticationService: AuthenticationService,
        private _flashMessagesService: FlashMessagesService,
        private _router: Router
         ) { }

    ngOnInit() {
       // this._flashMessagesService.show('We are in the login component!', { cssClass: 'alert-success', timeout: 3000 });
        // reset login status

    }


    login() {
        console.log('In login method');
        this.loading = true;

        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(result => {
                

                if (result) {
                    let logger = JSON.parse(result);
                    localStorage.setItem('currentUser', JSON.stringify(logger ) );

                    console.log('AUTHENTICATED! - : ' + JSON.stringify(logger) );
                    let redirect = '/welcome';

                    switch ( logger.user_type ) {
                        case 'admin':
                         redirect = '/admin';
                        break;
                        case 'teacher':
                        break;
                        case 'student':
                        break;
                        default:
                        break;
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
}
