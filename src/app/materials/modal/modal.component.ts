import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialCollection } from '../../models/materialcollection.model';
import { Globals } from '../../globals';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    moduleId: module.id,
    selector: 'modal',
    templateUrl: 'modal.component.html',
    styleUrls: ['modal.component.css']
})

export class ModalComponent implements OnInit {
    @Input() modalURL: string;
    @Output() closeMe = new EventEmitter<boolean>();
    safeURL: any;

    constructor( private globals: Globals, private domSanitizer: DomSanitizer) {    }

    ngOnInit() {
        this.safeURL = this.domSanitizer.bypassSecurityTrustResourceUrl(this.modalURL);
        this.modalURL = 'http://docs.google.com/gview?url=' + this.safeURL + '&embbeded=true';

    }

    close() {
        this.closeMe.emit(true);
    }

}
