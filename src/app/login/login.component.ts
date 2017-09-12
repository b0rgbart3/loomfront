import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user.model';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model = <User> {};
    loading = false;
    error = '';

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
    }

    login() {
        console.log('In login method');
        this.loading = true;

        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(result => {
                if (result === true) {
                    console.log("AUTHENTICATED!");
                    this.router.navigate(['/']);
                } else {
                    console.log("NOT AUTHENTICATED!");
                    this.error = 'Username or password is incorrect';
                    this.loading = false;
                }
            });
    }
}
