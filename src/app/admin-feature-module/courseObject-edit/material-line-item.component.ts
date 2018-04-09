import { Component, OnInit, Output, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../models/course.model';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../models/material.model';
import { Section } from '../../models/section.model';
import { Globals } from '../../globals2';

@Component({
    moduleId: module.id,
    selector: 'material-line-item',
    templateUrl: 'material-line-item.component.html',
    styleUrls: ['material-line-item.component.css']
})

export class MaterialLineItemComponent implements OnInit {

    reference: string;
    @Input() id: number;
    material: Material;
    constructor(private globals: Globals, private materialService: MaterialService) {

    }

    ngOnInit() {

        this.materialService.getMaterials( this.id ).subscribe(
            material => { this.material = material[0];
           //  console.log('loaded material: ' + JSON.stringify(material));
         }
        );

    }

}
