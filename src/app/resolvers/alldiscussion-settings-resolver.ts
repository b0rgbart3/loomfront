import { Component, OnInit, Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { DiscussionSettings } from '../models/discussionsettings.model';
import { DiscussionService } from '../services/discussion.service';
import { ClassService } from '../services/class.service';
import { UserService } from '../services/user.service';

@Injectable()

export class AllDiscussionSettingsResolver implements Resolve <DiscussionSettings[]> {

    constructor( private ds: DiscussionService,
        private classService: ClassService, private router: Router,
    private userService: UserService ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable <DiscussionSettings[]> {
      //  console.log('IN the ALL DS Resolver.');

        return this.ds.getAllDiscussionSettings().
        map(dsObjects => {
        //    console.log('In the all ds resolver - returning: ' + JSON.stringify(dsObjects));
            return dsObjects;
        }
        ).catch( error => {
        console.log(`DS Retrieval error: ${error}`);
        return Observable.of(null);
        });
    }
}
