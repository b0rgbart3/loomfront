import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user.model';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RouterModule, Routes, NavigationExtras, Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model = <User> {};
    loading = false;
    error = '';
    message: string;

    constructor(
        private authenticationService: AuthenticationService,
        private _flashMessagesService: FlashMessagesService,
        private _router: Router,
        private data: DataService
         ) { }

    ngOnInit() {
       // this._flashMessagesService.show('We are in the login component!', { cssClass: 'alert-success', timeout: 3000 });
        // reset login status
        this.data.currentMessage.subscribe(message => this.message = message);
    }

    login() {
        console.log('In login method');
        this.loading = true;

        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(result => {
                if (result === true) {
                    console.log("AUTHENTICATED!");
                    // Get the redirect URL from our auth service
                    // If no redirect has been set, use the default
                    // let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/admin';
                    //  this.authenticationService.updateMyself();
                    this.data.changeMessage("Bartman");
                    
                    let redirect =  '/studenthome';

                // Set our navigation extras object
                // that passes on our global query params and fragment
                let navigationExtras: NavigationExtras = {
                  queryParamsHandling: 'preserve',
                  preserveFragment: true
                };

                // Redirect the user
                //this.router.navigate([redirect], navigationExtras);
                this._router.navigate(['/studenthome']);
                } else {
                    console.log("NOT AUTHENTICATED!");
                    this.error = 'Username or password is incorrect';
                    this.loading = false;
                }
            },
        err => {
            console.log("NOT AUTHENTICATED!");
            this.error = 'Username or password is incorrect';
            this._flashMessagesService.show('Username or password was incorrect.', { cssClass: 'alert-warning', timeout: 7000 });
            this.loading = false;
        });
    }
}
