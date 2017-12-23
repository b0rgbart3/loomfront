import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialCollection } from '../../models/materialcollection.model';
import { Globals } from '../../globals';
import { RouterLinkWithHref } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'quote',
    templateUrl: 'quote.component.html',
    styleUrls: ['quote.component.css']
})

export class QuoteComponent implements OnInit {
    @Input() materialcollection: MaterialCollection;



    constructor( private globals: Globals) {    }

    ngOnInit() {

       //  console.log('mat collection: ' + JSON.stringify( this.materialcollection['quotes'] ));

    }


}
