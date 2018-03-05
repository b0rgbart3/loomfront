import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RouterModule, Routes, NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { User } from '../../models/user.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, DoCheck, AfterViewChecked, OnChanges } from '@angular/core';
import * as $ from 'jquery';
import { Validators } from '@angular/forms';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Globals } from '../../globals';
import {Location} from '@angular/common';

@Component({
    moduleId: module.id,
    templateUrl: 'user-settings.component.html',
    styleUrls: ['user-settings.component.css']
})

export class UserSettingsComponent implements OnInit, AfterViewChecked, OnChanges {
    user: User;
    thisFile: File;
    tempName: string;
    favoritecolor: FormControl;
    avatarInput: FormControl;
    firstname: FormControl;
    currentUserId;
    avatarimage: string;
    public avatarUploader: FileUploader;
    settingsForm: FormGroup;
    errorMessage: string;
    url: string;
    localImageUrl: string;
    avatar: string;
    biolength: number;
    avatarChanged: boolean;

    constructor(
        private _http: HttpClient,
        public userService: UserService,
        private router: Router,
        private _flashMessagesService: FlashMessagesService,
        private activated_route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder,
        private globals: Globals,
        private _location: Location ) {}

    myInit() {
        const urlWithQuery = this.globals.postavatars + '?userid=' + this.user.id;
        this.avatarUploader = new FileUploader({url: urlWithQuery});
        if (this.user.facebookRegistration) {
            this.localImageUrl = this.user.avatar_URL;
        } else {
             this.localImageUrl = this.globals.avatars + '/' +  this.user.id + '/' + this.user.avatar_filename;

            if (this.user.avatar_filename === '' || this.user.avatar_filename === undefined) {
                this.localImageUrl = this.globals.avatars + '/' + 'placeholder.png';
            }
        }

        this.avatarUploader.onAfterAddingFile = (fileItem) => {
            const url = (window.URL) ? window.URL.createObjectURL(fileItem._file)
                : (window as any).webkitURL.createObjectURL(fileItem._file);
            // this.localImageUrl = url;
            this.avatarUploader.queue[0].upload();
         };
         this.avatarUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {

            this.tempName = this.avatarUploader.queue[0].file.name;
            // console.log('Done uploading' + JSON.stringify(this.tempName));
            // console.log('USER: ' + JSON.stringify(this.user));
            alert('Your image will be cropped to fit a square aspect ratio.');
            this.localImageUrl = this.globals.avatars + '/' + this.user.id + '/' + this.tempName;

            this.avatarUploader.queue[0].remove();
            this.positionCropper();
        };

               //  Here I am using the formBuilder to build my form controls
               this.settingsForm = this.fb.group( {
                favoritecolor: [''],
                avatar: '',
                username: [ this.user.username, [Validators.required, Validators.minLength(3)] ],
                firstname: [ this.user.firstname, [Validators.required, Validators.minLength(3)] ],
                lastname: [ this.user.lastname, [Validators.required, Validators.minLength(3)] ],
                email: [this.user.email, [ Validators.required,
                Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')] ],
                bio: [ this.user.bio, [Validators.maxLength(400)]]
            });
            this.biolength = 0;
            if (this.user.bio) {
            this.biolength = this.user.bio.length; }
            this.settingsForm.get('bio').valueChanges.subscribe( value => { this.biolength = value.length;
                console.log('The bio changed: ' + value); });
           // console.log('USER: ' + JSON.stringify(this.user));

    }

    ngOnInit () {

        this.avatarChanged = false;
        const idFromURL = this.activated_route.snapshot.params['id'];
        console.log('In user settings, ID = ' + idFromURL);
        if (idFromURL) {
            this.user = this.userService.getUserFromMemoryById(idFromURL);

            if (this.user) {
            this.avatar = this.globals.avatars + '/' + this.user.id + '/' + this.user.avatar_filename;

            console.log('User: ' + JSON.stringify(this.user));
                this.myInit();
        }

            // this.userService.getUser(idFromURL).subscribe(
            //     user =>  {this.user = user[0];
            //         this.avatar = this.globals.avatars + '/' + this.user.id + '/' + this.user.avatar_filename;
            //         console.log('Got user and avatar: ' + JSON.stringify(this.user) + ', ' + this.avatar);
            //         this.myInit();
            //     },
            //     error => this.errorMessage = <any>error);
        } else {
            this.user = this.userService.getCurrentUser();
            this.avatar = this.globals.avatars + '/' + this.user.id + '/' + this.user.avatar_filename;
            this.myInit();
        }


    }


    avatarChange(event) {
        this.avatarChanged = true;
        const fileList: FileList = event.target.files;
        if ( fileList.length > 0) {
            const file: File = fileList[0];
            this.thisFile = file;

        }
    }

    positionCropper() {

    }
    populateForm(): void {

    }

    ngAfterViewChecked() {

    }

    ngOnChanges() {

    }

    cancel() {
        this._location.back();
//        this.router.navigate(['/welcome']);
    }
    submitSettings() {

        // No need to save the settings, if they haven't changed, or they're invalid
        if (this.settingsForm.valid && ( this.settingsForm.dirty || this.avatarChanged )) {
        console.log('In submitSettings');
        console.log('settingsForm.value: ' + JSON.stringify( this.settingsForm.value) );
        const settingsObject = Object.assign( {}, this.user, this.settingsForm.value);

        // If the logged in user is the same as the user being edit - then let's update the model
        // so that the loggged in user model has the new info
        if ( this.userService.getCurrentUser().id === this.user.id) {
            this.userService.resetCurrentUser(settingsObject); }

        // Combine the Form Model with our Data Model

        // The user is submitting their settings changes -
        // so we overwrite the User Object, and then save it back out to the database

        // const settingsObject = <User> this.user;
        // settingsObject['id'] = this.currentUserId;
        settingsObject['favoritecolor'] = this.settingsForm.value.favoritecolor;

        if ( this.tempName ) {
            settingsObject['avatar_filename'] = JSON.stringify(this.tempName);
            settingsObject['avatar_filename'] =
                    settingsObject['avatar_filename'].substring(1, settingsObject['avatar_filename'].length - 1);
            // settingsObject['avatar_path'] = 'http://localhost:3100/avatars/' + this.user.id + '/';
            // settingsObject['avatar_URL'] = settingsObject['avatar_path'] + settingsObject['avatar_filename'];
        }

        // this.userService.resetCurrentUser(settingsObject);
        console.log(JSON.stringify(settingsObject));
        this.userService.saveSettings( settingsObject ).subscribe(
            (val) => {
                console.log('POST call successful value returned in body ', val);
              },
              response => {
                console.log('POST call in error', response);
              },
              () => {
                console.log('The POST observable is now completed.');
                // this.userService.currentUser = settingsObject;
                this.router.navigate(['/welcome']);
              }
        );


    }
    }

}
