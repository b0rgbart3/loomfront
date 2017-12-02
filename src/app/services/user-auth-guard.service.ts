import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';

/* This authGuard is built for the user settings edit url
   It checks to see if the current user is editing their own settings --
   and if not -- then it checks to make sure the current user is an admin */

@Injectable()
export class UserAuthGuard implements CanActivate {

    constructor(private router: Router, private userService: UserService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const id = route.params['id'];
        if (this.userService.isloggedin()) {
            if (this.userService.getCurrentUser().id === id) {
                return true;
            } else {
                if (this.userService.isAdmin()) {
                    return true;
                } else {
                    this.router.navigate(['/home']);
                    return false;
                }
            }
        }
        this.router.navigate(['/login']);
        return false;
    }

}
