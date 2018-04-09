import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialCollection } from '../../models/materialcollection.model';
import { Globals } from '../../globals2';
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
 
    // 'https://docs.google.com/gview?url=' +

    ngOnInit() {
        const fullURL = this.modalURL;
        this.modalURL = <string> this.domSanitizer.bypassSecurityTrustResourceUrl(fullURL);
    }

    close() {
        console.log('emitting a closeMe truth.');
        this.closeMe.emit(true);
    }

}
