import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private userService: UserService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.checkLoggedIn();
    }

    checkLoggedIn(): boolean {
        if (this.userService.isloggedin()) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}
