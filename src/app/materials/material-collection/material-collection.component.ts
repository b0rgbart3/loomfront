import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialCollection } from '../../models/materialcollection.model';
import { Globals } from '../../globals';

@Component({
    moduleId: module.id,
    selector: 'material-collection',
    templateUrl: 'material-collection.component.html',
    styleUrls: ['material-collection.component.css']
})

export class MaterialCollectionComponent implements OnInit {
    @Input() materialcollection: MaterialCollection;
    videoPlaying: number;

    constructor( private globals: Globals) {    }

    ngOnInit() {
    }

    playVideo( index ) {
        console.log('About to play video: ' + index);
        this.videoPlaying = index;
    }
}
