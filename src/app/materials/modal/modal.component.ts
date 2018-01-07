import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialCollection } from '../../models/materialcollection.model';
import { Globals } from '../../globals';


@Component({
    moduleId: module.id,
    selector: 'modal',
    templateUrl: 'modal.component.html',
    styleUrls: ['modal.component.css']
})

export class ModalComponent implements OnInit {
    @Input() modalURL: string;
    @Output() closeMe = new EventEmitter<boolean>();


    constructor( private globals: Globals) {    }

    ngOnInit() {
        this.modalURL = this.modalURL + ' | safe' + '&embbeded=true';

    }

    close() {
        this.closeMe.emit(true);
    }

}
