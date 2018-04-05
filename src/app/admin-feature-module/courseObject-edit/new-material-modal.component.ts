import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { User } from '../../models/user.model';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RouterModule, Routes, NavigationExtras, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoomsFacebookService } from '../../services/loomsfacebook.service';
import { LoginResponse, FacebookService, InitParams } from 'ngx-facebook';
import { AlertService } from '../../services/alert.service';
import { Globals } from '../../globals';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Material } from '../../models/material.model';


@Component({
    moduleId: module.id,
    selector: 'new-material-modal',
    templateUrl: 'new-material-modal.component.html',
    styleUrls: ['new-material-modal.component.css']
})

export class NewMaterialModalComponent implements OnInit {

    display: boolean;
    material: Material;

    @Input() newMateriaModal: Subject<any>;
    @Output() onComplete= new EventEmitter <Material>();
    @Output() onClose = new EventEmitter <boolean>();
    constructor() {
    }

    ngOnInit() {

        this.display = false;

        // We subscribe to this "openModal" input variable -- so that whenever a new list
        // is added to this RxJs observable - we will get a notification that it's time to display
        // the modal - with new data

        this.newMateriaModal.subscribe( materialObject => {
            this.material = materialObject;
            this.display = true;
            console.log('got a new Material Object: ' + JSON.stringify(this.material));
        });
    }

    close() {
        this.onClose.emit(true);
        this.closeModal();
    }


    completed( material ) {
        this.onComplete.emit( material);
        this.closeModal();
    }

    closeModal() {
        // Here the user pre-maturely chose to Close the Modal - instead of making a selection
        this.display = false;
    }
}
