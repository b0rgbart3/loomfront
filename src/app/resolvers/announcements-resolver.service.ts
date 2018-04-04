import { Component, OnInit, Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Announcements } from '../models/announcements.model';
import { AnnouncementsService } from '../services/announcements.service';


@Injectable()
export class AnnouncementsResolver implements Resolve <Announcements[]> {

    constructor( private objectService: AnnouncementsService, private router: Router ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <any> {

        const id = route.params['id'];

        console.log('In announcements Resolver...');
        return this.objectService.getObjects(id).
        map(objects => { if (objects) {
            console.log('found announcements: ' + JSON.stringify(objects));
            return objects; }
        return null; })
    .catch(error => {
        return Observable.of(null);
    });

  }
}
