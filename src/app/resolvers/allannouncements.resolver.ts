import { Component, OnInit, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Enrollment } from '../models/enrollment.model';
import { EnrollmentsService } from '../services/enrollments.service';
import { UserService } from '../services/user.service';
import { ClassService } from '../services/class.service';
import { Announcements } from '../models/announcements.model';
import { AnnouncementsService } from '../services/announcements.service';


@Injectable()
// get the enrollments that the currentUser is a student in

export class AllAnnouncementsResolver implements Resolve <Announcements[]> {

    announcements: Announcements[];
    constructor( private router: Router, private announcementsService: AnnouncementsService,
        private classService: ClassService, private userService: UserService ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <Announcements[]> {

       // console.log('IN STUDENT ENROLLMENTS RESOLVER');
        return this.announcementsService.getAllAnnouncements().map( data => { this.announcements = data;
        // console.log('got data back from the API for enrollments: ' + JSON.stringify(data));
    return this.announcements; })
    .catch(error => {
        // this.router.navigate(['/welcome']);
        return Observable.of(null);
    });
    }


}
