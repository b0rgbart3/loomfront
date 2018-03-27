import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class AuthGuard implements CanActivate {

    loggedInUser: User;
    errorMessage: string;

    constructor(private router: Router, private userService: UserService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <boolean> {


        if (this.userService.isloggedin()) {
            console.log('Auth guard found logged in User.');
            const currentUser = this.userService.currentUser;
            return this.userService.getUser(currentUser.id).map(
                user =>  {
                    console.log('Auth guard was able to reload user');
                    this.loggedInUser = user[0];
                    console.log('User: ' + JSON.stringify(this.loggedInUser.suspended));
                    if (this.loggedInUser.suspended !== true) {
                        console.log('returned true');
                         return true;
                    } else {
                        this.userService.logout();
                        this.router.navigate(['/suspended']);
                    return false;
                    }
                });
            } else {
                this.router.navigate(['/login']);
                return Observable.of(false);
            }

    }



}
