import { Component, OnInit, Output, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../models/course.model';
import { MaterialService } from '../../materials/material.service';
import { Material } from '../../models/material.model';
import { Video } from '../../models/video.model';
import { Globals } from '../../globals';
const MATERIAL_PATH = 'http://localhost:3100/materialfiles/';



@Component({
    moduleId: module.id,
    selector: 'video-component',
    templateUrl: 'video.component.html',
    styleUrls: ['video.component.css']
})

export class VideoComponent implements OnInit {

    public icon: string;
    public reference: string;
    public iconref: string;
    videoPlaying: number;
    playing: boolean;
    backgroundImage: string;

    @Input() videoObject: Material;
    constructor( private globals: Globals ) {

    }

    ngOnInit() {
        this.playing = false;
        console.log('Video Object: ');
        console.log(JSON.stringify(this.videoObject) );
        this.backgroundImage = 'url('  + this.globals.materialimages + '/' + this.videoObject.id  +
        '/' + this.videoObject.image + ')';
    }

    playVideo( index ) {
        console.log('About to play video: ' + index);
        this.videoPlaying = index;
        this.playing = true;
    }
}
