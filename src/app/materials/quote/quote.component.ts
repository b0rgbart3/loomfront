import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialCollection } from '../../models/materialcollection.model';
import { Globals } from '../../globals2';
import { RouterLinkWithHref } from '@angular/router';
import { Material } from '../../models/material.model';

@Component({
    moduleId: module.id,
    selector: 'quote-component',
    templateUrl: 'quote.component.html',
    styleUrls: ['quote.component.css']
})

export class QuoteComponent implements OnInit {
    @Input() quoteObject: Material;



    constructor( private globals: Globals) {    }

    ngOnInit() {

       //  console.log('mat collection: ' + JSON.stringify( this.materialcollection['quotes'] ));

    }


}
