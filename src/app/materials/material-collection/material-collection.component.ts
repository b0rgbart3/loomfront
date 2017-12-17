import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialCollection } from '../../models/materialcollection.model';
import { Globals } from '../../globals';
import { RouterLinkWithHref } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'material-collection',
    templateUrl: 'material-collection.component.html',
    styleUrls: ['material-collection.component.css']
})

export class MaterialCollectionComponent implements OnInit {
    @Input() materialcollection: MaterialCollection;



    constructor( private globals: Globals) {    }

    ngOnInit() {


        if (this.materialcollection.documents) {
            console.log('found documents :' + this.materialcollection.documents.length);
            for (let i = 0; i < this.materialcollection.documents.length; i++) {
                console.log('document: ' + this.materialcollection.documents[i].title);

                if (this.materialcollection.documents[i].image) {
                    console.log('found an image: ' + this.materialcollection.documents[i].image);
                this.materialcollection.documents[i].imageURL = this.globals.materialimages + '/' +
                  this.materialcollection.documents[i].id + '/' + this.materialcollection.documents[i].image;  }
                if (this.materialcollection.documents[i].file) {
                this.materialcollection.documents[i].fileURL = this.globals.materialfiles + '/' +
                  this.materialcollection.documents[i].id + '/' + this.materialcollection.documents[i].file; }
            }
        }
    }

  open_modal(URL) {
      window.open(URL, '_blank');
  }
}
