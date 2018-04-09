import { Component, OnInit, Input } from '@angular/core';
import { Globals } from '../../../globals2';
import { ClickOutsideDirective } from '../../../_directives/clickOutside.directive';
import { Router } from '@angular/router';
import { Material } from '../../../models/material.model';



@Component({
    moduleId: module.id,
    selector: 'book',
    templateUrl: 'book.component.html',
    styleUrls: ['book.component.css'],
})

export class BookComponent implements OnInit {
    @Input() book: Material;
    imageURL: string;
    big: boolean;
constructor( private globals: Globals, private router: Router) {}

ngOnInit() {
 // console.log('In book component: book = ' + JSON.stringify(this.book));
  this.imageURL = this.globals.materialimages + '/' + this.book.id + '/' + this.book.image;
  this.big = false;
}

goBig(event) {
    this.big = !this.big;
   // console.log('in goBig');
    event.stopPropagation();
}

goSmall() {
    console.log('in goSmall');
    this.big = false;
}

open_modal(URL) {
    window.open(URL, '_blank');
}

}

