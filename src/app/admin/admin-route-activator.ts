import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AdminRouteActivator implements CanActivate {
    constructor( private authenticationService: AuthenticationService, private router: Router) {

    }

    canActivate() {
        const loggedIn = this.authenticationService.isloggedin();
        if (!loggedIn) {
            this.router.navigate(['/404']);
        }
        return loggedIn;
    }
}
