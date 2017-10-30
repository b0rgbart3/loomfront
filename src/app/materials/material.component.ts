import { Component, OnInit, Output, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../models/course.model';
import { MaterialService } from '../materials/material.service';
import { Material } from '../models/material.model';
import { Section } from '../models/section.model';
const MATERIAL_PATH = 'http://localhost:3100/materialfiles/';



@Component({
    moduleId: module.id,
    selector: 'material',
    templateUrl: 'material.component.html',
    styleUrls: ['material.component.css']
})

export class MaterialComponent implements OnInit {

    public icon: string;
    public reference: string;
    public iconref: string;

    @Input() material: Material;
    constructor() {

    }

    ngOnInit() {
        if (this.material.contenturl) {
            this.reference = this.material.contenturl;
         } else {
             this.reference = MATERIAL_PATH + this.material.id + '/' + this.material.file;
         }

        if (this.material.type) {
        switch (this.material.type) {
            case 'PDF document':
              this.icon = 'pdf';
              break;
            case 'video':
              this.icon = 'video';
              break;
            default:
              break;
        }
        this.iconref = '../assets/images/' + this.icon + '.png';
    }}

}
