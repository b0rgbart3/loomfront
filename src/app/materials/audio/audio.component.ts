import { Component, OnInit, Output, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../models/course.model';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../models/material.model';
import { Globals } from '../../globals';


@Component({
    moduleId: module.id,
    selector: 'audio-component',
    templateUrl: 'audio.component.html',
    styleUrls: ['audio.component.css']
})

export class AudioComponent implements OnInit {

    audioSource: string;

    @Input() audioObject: Material;
    constructor( private globals: Globals  ) {

    }

    ngOnInit(): void {
        this.audioSource = this.globals.materialfiles + '/' + this.audioObject.id + '/' + this.audioObject.file; // }

    }

    onRightClick() {
        return false;
    }

}
