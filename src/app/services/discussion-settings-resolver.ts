import { Component, OnInit, Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { DiscussionSettings } from '../models/discussionsettings.model';
import { DiscussionService } from './discussion.service';
import { ClassService } from './class.service';
import { UserService } from './user.service';

@Injectable()

export class DiscussionSettingsResolver implements Resolve <DiscussionSettings> {

    constructor( private ds: DiscussionService,
        private classService: ClassService, private router: Router,
    private userService: UserService ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable <DiscussionSettings> {
        const class_id = route.params['id'];
        const user_id = this.userService.currentUser.id;
        const section = route.params['id2'];
        console.log('In the discussion settings resolver - class: ' + class_id +
            ', section: ' + section + ', user: ' + user_id);

        return this.ds.getDiscussionSettings(user_id, class_id, section).
        map(dsObject => { if (dsObject) {
            console.log('found existing ds object.');
        return dsObject; } else {
                console.log('did not find ds object, so creating one.');
                const newDSObject = new DiscussionSettings( user_id, class_id, section, false, []);
        const returnableArray = [];
        returnableArray.push(newDSObject);
        console.log('returning: ' + JSON.stringify(returnableArray));
        return returnableArray;
            }
         })
    .catch( error => {
        console.log(`DS Retrieval error: ${error}`);
        return Observable.of(null);
    });
    }

}
