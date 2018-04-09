import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { User } from '../models/user.model';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RouterModule, Routes, NavigationExtras, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { LoomsFacebookService } from '../services/loomsfacebook.service';
import { LoginResponse, FacebookService, InitParams } from 'ngx-facebook';
import { AlertService } from '../services/alert.service';
import { Globals } from '../globals2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';


@Component({
    moduleId: module.id,
    selector: 'choice-modal',
    templateUrl: 'choice-modal.component.html',
    styleUrls: ['choice-modal.component.css']
})

export class ChoiceModalComponent implements OnInit {

    display: boolean;
    choices: string[];
    headline: string;
    type: string;

    @Input() ChoiceList: string[];
    @Input() openModal: Subject<any>;
    @Output() onChosen = new EventEmitter <number>();
    @Output() addNew = new EventEmitter <string>();
    constructor() {
    }

    ngOnInit() {

        this.display = false;

        // We subscribe to this "openModal" input variable -- so that whenever a new list
        // is added to this RxJs observable - we will get a notification that it's time to display
        // the modal - with new data

        this.openModal.subscribe( choiceList => {
            this.headline = choiceList.headline;
            this.choices = choiceList.choices;
            this.type = choiceList.type;
            this.display = true;
        });
    }

    add() {
        this.addNew.emit( this.type );
        this.display = false;
    }

    choose(choice) {
        this.onChosen.emit(choice);
        this.display = false;
    }

    closeModal() {
        // Here the user pre-maturely chose to Close the Modal - instead of making a selection
        this.display = false;
    }
}
