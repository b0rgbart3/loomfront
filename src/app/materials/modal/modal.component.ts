import { Component, OnInit, Input } from '@angular/core';
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



    constructor( private globals: Globals) {    }

    ngOnInit() {

       
    }


}
