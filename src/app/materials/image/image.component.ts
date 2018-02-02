import { Component, OnInit, Input } from '@angular/core';
import { Globals } from '../../globals';
import { ClickOutsideDirective } from '../../_directives/clickOutside.directive';
import { Router } from '@angular/router';
import { Material } from '../../models/material.model';



@Component({
    moduleId: module.id,
    selector: 'image-component',
    templateUrl: 'image.component.html',
    styleUrls: ['image.component.css'],
})

export class ImageComponent implements OnInit {
    @Input() imageObject: Material;
    imageURL: string;

constructor( private globals: Globals, private router: Router) {}

ngOnInit() {
    this.imageURL = this.imageObject.imageURL;
 // console.log('In book component: book = ' + JSON.stringify(this.book));
 // this.imageURL = this.globals.materialfiles + '/' + this.imageObject.id + '/' + this.imageObject.file;

}

}
