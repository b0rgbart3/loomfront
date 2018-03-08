import { Component, OnInit, Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { ClassService } from '../services/class.service';
import { UserService } from '../services/user.service';
import { NotesSettings } from '../models/notessettings.model';
import { NotesService } from '../services/notes.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Message } from '../models/message.model';
import { MessageService } from '../services/message.service';

@Injectable()

export class MessagesResolver implements Resolve <Message[]> {

    constructor( private messageService: MessageService,
        private classService: ClassService, private router: Router,
    private userService: UserService ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable <Message[]> {
        const class_id = route.params['id'];

        if (this.userService.currentUser) {
        const user_id = this.userService.currentUser.id;

        const section = route.params['id2'] + '';
        // console.log('In the notes settings resolver - class: ' + class_id +
        //     ', section: ' + section + ', user: ' + user_id);

        return this.messageService.getMessages().
        map(messages => { if (messages) {
          //  console.log('found existing messages.');
        return messages; } else {
        //   console.log('did not find any messages');

        // const returnableArray = [];
        // returnableArray.push(newDSObject);
       // console.log('returning: ' + JSON.stringify(returnableArray));
        return null;
            }
         })
    .catch( error => {
        console.log(`DS Retrieval error: ${error}`);
        return Observable.of(null);
    });
    }
    }

}
