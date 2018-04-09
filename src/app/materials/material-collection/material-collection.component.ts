import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialCollection } from '../../models/materialcollection.model';
import { Globals } from '../../globals2';
import { RouterLinkWithHref } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'material-collection',
    templateUrl: 'material-collection.component.html',
    styleUrls: ['material-collection.component.css']
})

export class MaterialCollectionComponent implements OnInit {
    @Input() materialcollection: MaterialCollection;

    displayModal: boolean;
    modalURL: string;


    constructor( private globals: Globals) {    }

    ngOnInit() {

      this.displayModal = false;
      this.modalURL = '';

        if (this.materialcollection.docs) {
          //  console.log('found documents :' + this.materialcollection.docs.length);
            for (let i = 0; i < this.materialcollection.docs.length; i++) {
               // console.log('document: ' + this.materialcollection.docs[i].title);

                if (this.materialcollection.docs[i].image && (this.materialcollection.docs[i].image !== undefined)) {
              //  this.materialcollection.docs[i].imageURL = this.globals.materialimages + '/' +
                //  this.materialcollection.docs[i].id + '/' + encodeURI(this.materialcollection.docs[i].image);
               }
                if (this.materialcollection.docs[i].file && ( this.materialcollection.docs[i].file !== undefined)) {
               // this.materialcollection.docs[i].fileURL = this.globals.materialfiles + '/' +
                //  this.materialcollection.docs[i].id + '/' + this.materialcollection.docs[i].file;
               }
            }
        }
    }


  open_modal( object ) {
     // window.open(URL, '_blank');

     console.log('Opening modal: ' + JSON.stringify( object ));
     this.displayModal = true;
     this.modalURL = object.fileURL;
  }

  closeModal( truth ) {
    this.displayModal = false;
  }
}
