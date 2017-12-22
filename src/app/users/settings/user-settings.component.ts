import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RouterModule, Routes, NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { FileUploader} from 'ng2-file-upload';
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
    public uploader: FileUploader;
    settingsForm: FormGroup;
    errorMessage: string;
    url: string;
    localImageUrl: string;

    constructor(
        private _http: HttpClient,
        public userService: UserService,
        private router: Router,
        private _flashMessagesService: FlashMessagesService,
        private activated_route: ActivatedRoute,
        private sanitizer: DomSanitizer, private fb: FormBuilder) {}

    myInit() {
               //  Here I am using the formBuilder to build my form controls
               this.settingsForm = this.fb.group( {
                favoritecolor: [''],
                avatar: '',
                username: [ this.user.username, [Validators.required, Validators.minLength(3)] ],
                firstname: [ this.user.firstname, [Validators.required, Validators.minLength(3)] ],
                lastname: [ this.user.lastname, [Validators.required, Validators.minLength(3)] ],
                email: [this.user.email, [ Validators.required,
                    Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')] ],
            });
            this.settingsForm.valueChanges.subscribe( value => console.log(value) );
            console.log('USER: ' + JSON.stringify(this.user));
        // this.user = this.userService.getCurrentUser();
        // if (this.user) {
        //     this.currentUserId = this.user.id;
        // }
    }

    ngOnInit () {
        const idFromURL = this.activated_route.snapshot.params['id'];
        if (idFromURL) {
            this.userService.getUser(idFromURL).subscribe(
                user =>  {this.user = user[0];
                    this.myInit();
                },
                error => this.errorMessage = <any>error);
        } else {
            this.user = this.userService.getCurrentUser();
            this.myInit();
        }




        const urlWithQuery = 'http://localhost:3100/api/avatar?userid=' + this.currentUserId;
        this.uploader = new FileUploader({url: urlWithQuery});
        this.uploader.onAfterAddingFile = (fileItem) => {
            const url = (window.URL) ? window.URL.createObjectURL(fileItem._file)
                : (window as any).webkitURL.createObjectURL(fileItem._file);
            // this.localImageUrl = url;
            this.uploader.queue[0].upload();
         };
         this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {

            this.tempName = this.uploader.queue[0].file.name;
            console.log('Done uploading' + JSON.stringify(this.tempName));
            console.log('USER: ' + JSON.stringify(this.user));
            alert('Your image will be cropped to fit a square aspect ratio.');
            // const newfilename = 'avatar.' + this.tempName.split('.')[this.tempName.split('.').length - 1];
            // console.log('New name: ' + newfilename);
            // this.avatarimage = 'http://localhost:3100/avatars/' + this.currentUserId + '/' + newfilename;

            // localStorage.setItem('avatarimage', this.avatarimage);
            this.localImageUrl = 'http://localhost:3100/avatars/' + this.user.id + '/' + this.tempName;

            this.uploader.queue[0].remove();
            this.positionCropper();
        };


    }


    fileChange(event) {
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
        this.router.navigate(['/welcome']);
    }
    submitSettings() {
        console.log('In submitSettings');
        console.log('settingsForm.value: ' + JSON.stringify( this.settingsForm.value) );
        const settingsObject = Object.assign( {}, this.user, this.settingsForm.value);
        this.userService.resetCurrentUser(settingsObject);

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

        this.userService.resetCurrentUser(settingsObject);
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
                this.router.navigate(['/welcome']);
              }
        );


    }


}
