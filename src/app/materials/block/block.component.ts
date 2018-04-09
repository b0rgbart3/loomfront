import { Component, OnInit, Input } from '@angular/core';
import { Globals } from '../../globals2';
import { ClickOutsideDirective } from '../../_directives/clickOutside.directive';
import { Router } from '@angular/router';
import { Material } from '../../models/material.model';



@Component({
    moduleId: module.id,
    selector: 'block',
    templateUrl: 'block.component.html',
    styleUrls: ['block.component.css'],
})

export class BlockComponent implements OnInit {
    @Input() block: Material;
    imageURL: string;
    display: boolean;
    big: boolean;
constructor( private globals: Globals, private router: Router) {}

ngOnInit() {
 // console.log('In book component: book = ' + JSON.stringify(this.book));
  this.imageURL = this.globals.materialimages +
     '/' + this.block.id + '/' + this.block.image;
  this.display = false;
}

toggleDisplay() {
    this.display = !this.display;
}

}

