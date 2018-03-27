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

export class DiscussionSettingsResolver implements Resolve <DiscussionSettings> {

    constructor( private ds: DiscussionService,
        private classService: ClassService, private router: Router,
    private userService: UserService ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable <DiscussionSettings> {
        const class_id = route.params['id'];
        if (this.userService.currentUser && this.userService.currentUser.id) {
        const user_id = this.userService.currentUser.id;
        const section = route.params['id2'];
       // console.log('In the discussion settings resolver - class: ' + class_id +
      //      ', section: ' + section + ', user: ' + user_id);

        return this.ds.getDiscussionSettings(user_id, class_id, section).
        map(dsObject => { if (dsObject) {
        //   console.log('found existing ds object:' + JSON.stringify(dsObject));
        //   console.log(dsObject.length);
        if (dsObject.length >= 1) {
            dsObject = dsObject[0];
        }
        // I don't know why I'm getting an empty object returned to me, but if that's the case....
        if (dsObject.length < 1) {
            const newDSObject = this.ds.createNewDSObject(user_id, class_id, section);
          //  console.log('length was zero, so we created a new object: ' + JSON.stringify(newDSObject));
            return newDSObject;
        }
        return dsObject; } else {
            //  console.log('did not find ds object, so creating one.');
                const newDSObject = this.ds.createNewDSObject(user_id, class_id, section);
        // const returnableArray = [];
        // returnableArray.push(newDSObject);
       // console.log('returning: ' + JSON.stringify(returnableArray));
        return newDSObject;
            }
         })
    .catch( error => {
        console.log(`DS Retrieval error: ${error}`);
        return Observable.of(null);
    });
    } }

}
