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

export class UserSettingsComponent implements OnInit {
    user: User;

    public imageUploader: FileUploader;
    settingsForm: FormGroup;
    errorMessage: string;

    image: string;
    imageUrl: string;
    biolength: number;
    thisFile: File;
    avatarChanged: boolean;
    tempName: string;
    localImageUrl: string;
    maxFileSize: number;

    public hasBaseDropZoneOver = false;
    public hasAnotherDropZoneOver = false;

    constructor(
        public userService: UserService,
        private router: Router,
        private activated_route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder,
        private globals: Globals,
        private _location: Location ) {}

        // updateDisplay() {
        //     console.log('Done uploading');
        //     this.imageUrl = this.globals.avatars + '/' + this.user.id + '/' + this.image;
        // }
        private formatBytes(bytes, decimals?) {
            if (bytes === 0) { return '0 Bytes'; }
            const k = 1024,
              dm = decimals || 2,
              sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
              i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
              }

    myInit() {

        this.maxFileSize = 5 * 1024 * 1024;
        if (!this.user) {
            this.router.navigate(['/']);
        }
        console.log('This user id: ' + this.user.id);
        const urlWithQuery = this.globals.postavatars + '?id=' + this.user.id;
        console.log('after url query defined.');
      //  this.imageUploader = new FileUploader({url: urlWithQuery});

        // this.imageUploader = new FileUploader({
        //     url: urlWithQuery,
        //     disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
        //     formatDataFunctionIsAsync: true,
        //     formatDataFunction: async (item) => {
        //       return new Promise( (resolve, reject) => {
        //         resolve({
        //           name: item._file.name,
        //           length: item._file.size,
        //           contentType: item._file.type,
        //           date: new Date()
        //         });
        //       });
        //     }
        //   });

        this.imageUploader = new FileUploader({url: urlWithQuery,
            maxFileSize: this.maxFileSize,
            allowedMimeType: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif' ]
              },
        );

        this.imageUploader.onAfterAddingFile = (fileItem) => {
         //   const url = (window.URL) ? window.URL.createObjectURL(fileItem._file)
           //     : (window as any).webkitURL.createObjectURL(fileItem._file);
           // this.imageUrl = url;
           // console.log('In build form: onAfterAddingFile: url =' + url);
           this.imageUploader.queue[0].upload();

        };
        this.imageUploader.onWhenAddingFileFailed = (item, filter) => {
            let message = '';
            switch (filter.name) {
              case 'queueLimit':
                message = 'Queue Limit surpassed';
                break;
              case 'fileSize':
                message = 'The file: ' + item.name + ' is ' +
                 this.formatBytes(item.size) +
                 ', which exceeds the maximum filesize of:  ' +
                  this.formatBytes(this.maxFileSize) + '. Please resize this image or choose a different file';
                break;
              case 'mimeType':
                message = 'Your avatar image needs to be a Jpeg, Jpg, PNG or Gif file-type.';
                break;
              default:
                message = 'Error uploading the image';
                break;
            }

            alert(message);

          };

        this.imageUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            console.log('item complete.');
            this.avatarChanged = true;
          //  this.imageUrl = null;
                        this.tempName = this.imageUploader.queue[0].file.name;
                         this.image = this.tempName;
                         this.imageUrl = this.globals.avatars + '/' + this.user.id + '/' +
                          this.image;
                         this.imageUploader.queue[0].remove();
                       //  this.updateDisplay();
                     };


               //  Here I am using the formBuilder to build my form controls
               this.settingsForm = this.fb.group( {
                favoritecolor: [''],
                imageUploader: '',
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
            this.settingsForm.get('bio').valueChanges.subscribe( value => { if (value) {this.biolength = value.length;
                console.log('The bio changed: ' + value); } });
    }

    ngOnInit () {

        const idFromURL = this.activated_route.snapshot.params['id'];
 
        if (idFromURL) {
            this.user = this.userService.getUserFromMemoryById(idFromURL);

            if (this.user) {
                this.image = this.user.avatar_filename;
                if (this.image) {
                    console.log('including an image with this avatar');
                  this.imageUrl = this.globals.avatars + '/' + this.user.id + '/' + this.image;
                } else { this.imageUrl = null; }
            }
        } else {
            this.router.navigate(['/']);
        }

        this.myInit();
    }


    // imageChange(event) {
    //     const fileList: FileList = event.target.files;
    //     if ( fileList.length > 0) {
    //         const file: File = fileList[0];
    //         console.log('Got a file: ' + file.name);
    //         this.thisFile = file;
    //         this.user.avatar_filename = file.name;
    //         this.imageUrl = this.globals.avatars + '/' + this.user.id + '/' + file.name;

    //     }
    // }


    populateForm(): void {

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

        settingsObject.avatar_filename = this.thisFile;
        settingsObject.avatar_URL = this.imageUrl;
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
                // Now that we are done saving the changes - we can reset the form so that the Guard doesn't think it's still fresh
                this.settingsForm.reset();
                this.avatarChanged = false;
                this.router.navigate(['/']);
              }
        );



    }
    }

}
