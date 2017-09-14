import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user.model';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AppRoutingModule, routableComponents } from '../app-routing.module';
import { RouterModule, Routes, NavigationExtras, Router } from '@angular/router';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model = <User> {};
    loading = false;
    error = '';

    constructor(
        private authenticationService: AuthenticationService,
        private _flashMessagesService: FlashMessagesService,
        private router: Router
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
                if (result === true) {
                    console.log("AUTHENTICATED!");
                    // Get the redirect URL from our auth service
                    // If no redirect has been set, use the default
                    // let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/admin';
                    
                    let redirect =  '/users';
                    
                // Set our navigation extras object
                // that passes on our global query params and fragment
                let navigationExtras: NavigationExtras = {
                  queryParamsHandling: 'preserve',
                  preserveFragment: true
                };
        
                // Redirect the user
                this.router.navigate([redirect], navigationExtras);
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
