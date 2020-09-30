import { Component, OnInit, ViewChild, Type } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RouterModule, Routes, NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
// import { Http, Response, Headers, RequestOptions } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { User } from '../../models/user.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, DoCheck, AfterViewChecked, OnChanges } from '@angular/core';
import * as $ from 'jquery';
import { Validators } from '@angular/forms';
//import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileUploader } from 'ng2-file-upload';

import { Globals } from '../../globals2';
import {Location} from '@angular/common';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ngx-img-cropper';


@Component({
    moduleId: module.id,
    templateUrl: 'user-settings.component.html',
    styleUrls: ['user-settings.component.css'],
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

    // Cropper
    chosenFile: string;
    cropperSettings: CropperSettings;
    data: any;

    @ViewChild('cropper') cropper: ImageCropperComponent;
    constructor(
        public userService: UserService,
        private router: Router,
        private activated_route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder,
        private globals: Globals,
        private _location: Location ) {

            this.cropperSettings = new CropperSettings();
            this.cropperSettings.width = 200;
            this.cropperSettings.height = 200;
            this.cropperSettings.keepAspect = false;
            this.cropperSettings.croppedWidth = 600;
            this.cropperSettings.croppedHeight = 600;
            this.cropperSettings.canvasWidth = 500;
            this.cropperSettings.canvasHeight = 300;
            this.cropperSettings.minWidth = 100;
            this.cropperSettings.minHeight = 100;
            this.cropperSettings.rounded = true;
            this.cropperSettings.minWithRelativeToResolution = false;
            this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
            this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
            this.cropperSettings.noFileInput = true;
            this.data = {};
        }




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

    sendData() {
       //  this.imageUploader.addToQueue(this.data.image);
      // console.log('cropper: ' + JSON.stringify())
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
           // allowedMimeType: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif' ]
              },
        );


        this.imageUploader.onAfterAddingFile = (fileItem) => {
         //   const url = (window.URL) ? window.URL.createObjectURL(fileItem._file)
           //     : (window as any).webkitURL.createObjectURL(fileItem._file);
           // this.imageUrl = url;
           // console.log('In build form: onAfterAddingFile: url =' + url);

           // this.imageUploader.queue[0].upload();
            // Instead of uploading this image right away - we are first going to send it to the cropper
            // and then try to send the modified version to the uploader


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
                         this.imageUrl = this.globals.avatars + '/' + this.user.id + '/avatar.jpg';
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
                  this.imageUrl = this.globals.avatars + '/' + this.user.id + '/' + this.user.avatar_filename;
                } else { this.imageUrl = null; }
            }
        } else {
            this.router.navigate(['/']);
        }

        this.myInit();
    }



    useThis() {
       // console.log('ready to upload: ' + JSON.stringify(this.data));
      //  this.data.image.filename = this.chosenFile.filename;
    //  this.imageUploader.queue[0].fileItem = this.data.image;
      //  console.log(this.imageUploader.queue[0]);
        //  console.log('Use This: ' + this.data.image);
        // const fakeFileObject = { files: [ {data: this.data.image, filename: 'bart.jpg' }]};
        //  const imageObject = { image: fakeFileObject, id: this.user.id };
        //  this.userService.uploadAvatar(imageObject).subscribe(
        //      data => { console.log('uploaded.');
        //     console.log('data' + JSON.stringify(data) ); }
        //  );
        // const fakeFile = new File([this.data.image], 'croppedAvatar');

        const nameParts = this.chosenFile.split('.');
        nameParts.pop();
        const name = nameParts.join();
        console.log('Chosen File: ' + name);

        const blob = this.dataURItoBlob(this.data.image);
        this.tempName = name + new Date().getTime() + '.jpg';
        const fakeFile = new File([blob], this.tempName);
        // const fd = new FormData(document.forms[0]);
        // const xhr = new XMLHttpRequest();

       // fd.append('myFile', blob);
        // xhr.open('POST', '/', true);
        // xhr.send(fd);

     this.imageUploader.addToQueue([ fakeFile ]);
     this.imageUploader.queue[1].upload();

     this.imageUrl = this.globals.avatars + '/' + this.user.id + '/' + this.tempName;
    }

    // imageChange(event) {
    //     const fileList: FileList = event.target.files;
    //     if ( fileList.length > 0) {
    //         this.chosenFile = fileList[0];
    //         console.log('Got a file: ' + this.chosenFile.name);
    //         // this.thisFile = file;
    //         // this.user.avatar_filename = file.name;
    //         // this.imageUrl = this.globals.avatars + '/' + this.user.id + '/' + file.name;

    //          this.data = this.chosenFile;

    //     }
    // }


    populateForm(): void {

    }

    cancel() {
        this._location.back();
    }
    submitSettings() {


        // No need to save the settings, if they haven't changed, or they're invalid
        if (this.settingsForm.valid && ( this.settingsForm.dirty || this.avatarChanged )) {
        console.log('In submitSettings');
        console.log('settingsForm.value: ' + JSON.stringify( this.settingsForm.value) );
        const settingsObject = Object.assign( {}, this.user, this.settingsForm.value);

        if (this.avatarChanged) {
            this.useThis();
            // const nameParts = this.chosenFile.split('.');
            // nameParts.pop();
            // const name = nameParts.join();

          settingsObject.avatar_filename = this.tempName;
          settingsObject.avatar_URL = '';
        }
        // If the logged in user is the same as the user being edit - then let's update the model
        // so that the loggged in user model has the new info
        if ( this.userService.getCurrentUser().id === this.user.id) {
            this.userService.resetCurrentUser(settingsObject); }

        // Combine the Form Model with our Data Model

        // The user is submitting their settings changes -
        // so we overwrite the User Object, and then save it back out to the database

        // const settingsObject = <User> this.user;
        // settingsObject['id'] = this.currentUserId;
//        settingsObject['favoritecolor'] = this.settingsForm.value.favoritecolor;

        // if ( this.tempName ) {
        //     settingsObject['avatar_filename'] = JSON.stringify(this.tempName);
        //     settingsObject['avatar_filename'] =
        //             settingsObject['avatar_filename'].substring(1, settingsObject['avatar_filename'].length - 1);
        //     // settingsObject['avatar_path'] = 'http://localhost:3100/avatars/' + this.user.id + '/';
        //     // settingsObject['avatar_URL'] = settingsObject['avatar_path'] + settingsObject['avatar_filename'];
        // }

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


    dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        const byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }


        return new Blob([ab], {type: mimeString});

    }



    /**
     * Used to send image to second cropper
     * @param $event
     */
    fileChangeListener($event) {
        const image: any = new Image();
        const file: File = $event.target.files[0];
        this.chosenFile = file.name;
        const myReader: FileReader = new FileReader();
        const that = this;
        this.avatarChanged = true;

        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            that.cropper.setImage(image);
            console.log('In Listener: ' + image);

        };

        myReader.readAsDataURL(file);
    }


}
