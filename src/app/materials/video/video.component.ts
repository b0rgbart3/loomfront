import { Component, OnInit, Output, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../models/course.model';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../models/material.model';
import { Video } from '../../models/video.model';
import { Globals } from '../../globals';

import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';
import {VgAPI} from 'videogular2/core';

import { DomSanitizer } from '@angular/platform-browser';
import { SafeResourceUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';

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
    posterImage: string;
    preload = 'auto';
    api: VgAPI;
    started: boolean;
    videoSource: SafeResourceUrl;
    videoBoxClass: string;
    videoDeetsClass: string;
    safeVideoSource: SafeResourceUrl;

    @Input() videoObject: Material;
    constructor( private globals: Globals, private domSanitizer: DomSanitizer ) {

    }

    onPlayerReady(api: VgAPI) {
        this.api = api;

        this.api.getDefaultMedia().subscriptions.ended.subscribe(
            () => {
                // Set the video to the beginning
                this.api.getDefaultMedia().currentTime = 0;
            }
        );
        this.api.getDefaultMedia().subscriptions.play.subscribe(
            () => {
                console.log('Playing');
                this.playing = true;
                this.started = true;
            }
        );
        this.api.getDefaultMedia().subscriptions.pause.subscribe(
            () => {
                console.log('Playing');
                this.playing = false;
            }
        );
    }

    ngOnInit() {
        this.playing = false;
        this.started = false;
        this.safeVideoSource = null;
      //  console.log('Video Object: ');
      //  console.log(JSON.stringify(this.videoObject) );
        this.backgroundImage = 'url('  + this.globals.materialimages + '/' + this.videoObject.id  +
        '/' + this.videoObject.image + ')';
        this.posterImage = this.globals.materialimages + '/' + this.videoObject.id + '/' + this.videoObject.image;
        if (this.videoObject.contenturl) {
            console.log('my dirty url: ' + this.videoObject.contenturl);
            this.videoSource = this.cleanUpMyURL(this.videoObject.contenturl);
            // <string> this.domSanitizer.bypassSecurityTrustResourceUrl(this.videoObject.contenturl);
        } else {
        this.videoSource = this.globals.materialfiles + '/' + this.videoObject.id + '/' + this.videoObject.file; }
        this.videoBoxClass = 'videoBox';
        this.videoDeetsClass = 'videoDeets';
    }

    playVideo( index ) {
      //  console.log('About to play video: ' + index);
        this.videoPlaying = index;
        this.playing = true;
    }

    cleanUpMyURL(dirtyURL) {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(dirtyURL);
    }

    theatre() {
        if (this.videoBoxClass === 'videoBox') {
        this.videoBoxClass = 'theatreBox';
        this.videoDeetsClass = 'theatreDeets';
    } else {
            this.videoBoxClass = 'videoBox';
            this.videoDeetsClass = 'videoDeets';
        }
    }
}
