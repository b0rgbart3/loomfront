import { Component, OnInit, Output } from '@angular/core';
import { User } from '../models/user.model';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RouterModule, Routes, NavigationExtras, Router } from '@angular/router';
import { UserService } from '../users/user.service';


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
        private _flashMessagesService: FlashMessagesService,
        private _router: Router,
        private userService: UserService
         ) { }

    ngOnInit() {
       // this._flashMessagesService.show('We are in the login component!', { cssClass: 'alert-success', timeout: 3000 });
        // reset login status

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
}
