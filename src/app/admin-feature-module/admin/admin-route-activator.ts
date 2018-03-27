import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from '../../services/user.service';

@Injectable()
export class AdminRouteActivator implements CanActivate {
    constructor( private userService: UserService, private router: Router) {

    }

    canActivate() {
        const loggedIn = this.userService.isloggedin();
        const admin = this.userService.isAdmin();

        if (loggedIn && admin) {
            return true; } else {
                this.router.navigate(['/permission']);
            return false;
        }
    }
}
