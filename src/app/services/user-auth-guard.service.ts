import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';

/* This authGuard is built for the user settings edit url
   It checks to see if the current user is editing their own settings --
   and if not -- then it checks to make sure the current user is an admin */

@Injectable()
export class UserAuthGuard implements CanActivate {

    constructor(private router: Router, private userService: UserService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <boolean> {
        const id = route.params['id'];
        console.log('In user-auth: id: ' + id);

        if (id !== this.userService.currentUser.id) {
            // The id in the url should match the id of the logged in user -- otherwise a user is attempting to
            // edit the settings of another user -- this is only allowable for administrators
        // If the user is not designated as an administrator - then let's send this enterprising soul to the permission denied component
        const authorized = this.userService.isAdmin();
        if (!authorized) { this.router.navigate(['/permission']); return Observable.of(false); }
        }

        return this.userService.getUser(id).map(
            foundUser => {
                console.log('Found User: ' + JSON.stringify(foundUser));
                if (foundUser && foundUser[0] && foundUser[0].id === id) {
                    console.log('We found that user.');
                    return true;
                } else {  console.log('We did not find that user.');
                this.router.navigate(['/']);
                    return false; }
            }
        );

    }

}
