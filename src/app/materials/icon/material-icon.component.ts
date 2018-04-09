import { Component, OnInit, Output, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../models/material.model';
import { Globals } from '../../globals2';

@Component({
    moduleId: module.id,
    selector: 'material-icon',
    templateUrl: 'material-icon.component.html',
    styleUrls: ['material-icon.component.css']
})

export class MaterialIconComponent implements OnInit {

    @Input() type: string;
    iconStyle: string;
    constructor(private globals: Globals, private materialService: MaterialService) {

    }

    ngOnInit() {

        this.iconStyle = 'icon icon-' + this.type;

    }

}
