import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

import { FlashMessagesService } from 'angular2-flash-messages';
import { RouterModule, Routes, NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
// import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from '../../models/user.model';
import { Avatar } from '../../models/avatar.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Pipe } from '@angular/core';


// @Pipe({name: 'secureUrl'})
//  export class Url {
//   constructor(private sanitizer: DomSanitizer){
//     this.sanitizer = sanitizer;
//   }
//   transform(url) {
//         return this.sanitizer.bypassSecurityTrustResourceUrl(url).changingThisBreaksApplicationSecurity;
//   }
// }


@Component({
    moduleId: module.id,
    templateUrl: 'user-settings.component.html',
    styleUrls: ['user-settings.component.css']
})

export class UserSettingsComponent implements OnInit {
    user: User;
    thisFile: File;
    favoriteColor: FormControl;
    avatar: FormControl;
    currentUserId;
    currentAvatar: Avatar;
    currentAvatarFile: string;
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
        private authenticationService: AuthenticationService,
        private activated_route: ActivatedRoute,
        private sanitizer: DomSanitizer) {}

    ngOnInit () {
        this.favoriteColor = new FormControl();
        this.avatar = new FormControl();
        this.settingsForm = new FormGroup ( {
            favoriteColor: this.favoriteColor,
            avatar: this.avatar
        } );
        this.user = this.authenticationService.loggedInUser();
        this.currentUserId = this.authenticationService.getUserId();
        this.getCurrentAvatar();

        const urlWithQuery = 'http://localhost:3100/api/avatar?userid=' + this.currentUserId;
        this.uploader = new FileUploader({url: urlWithQuery});
        this.uploader.onAfterAddingFile = (fileItem) => {
            const url = (window.URL) ? window.URL.createObjectURL(fileItem._file)
                : (window as any).webkitURL.createObjectURL(fileItem._file);
            this.localImageUrl = url; };

        this.favoriteColor.valueChanges.subscribe( value => console.log(value) );
        this.avatar.valueChanges.subscribe( value => console.log('value change: ' + value) );
    }

    getCurrentAvatar () {
        this.userService.getAvatar(this.currentUserId).subscribe(
            avatar => {this.currentAvatar = avatar;
                this.currentAvatarFile = 'http://localhost:3100/avatars/' + this.currentUserId + '/' + this.currentAvatar[0].filename;
                this.sanitizer.bypassSecurityTrustResourceUrl(this.currentAvatarFile);
                // this.currentAvatarFile = imageFile;
            console.log(JSON.stringify(this.currentAvatar) ); },
            error => this.errorMessage = <any>error);
    }

    fileChange(event) {
        const fileList: FileList = event.target.files;
        if ( fileList.length > 0) {
            const file: File = fileList[0];
            console.log('Got a file: ' + file.name);
            this.thisFile = file;
            console.log( JSON.stringify( file ) );
            // const formData: FormData = new FormData();
            // formData.append('uploadFile', file, file.name);
            // const headers = new Headers();
            /** No need to include Content-Type in Angular 4 */
            // headers.append('Content-Type', 'multipart/form-data');
            // headers.append('Accept', 'application/json');
            // const options = new RequestOptions({ headers: headers });
            // this.http.post(`${this.apiEndPoint}`, formData, options)
            //     .map(res => res.json())
            //     .catch(error => Observable.throw(error))
            //     .subscribe(
            //         data => console.log('success'),
            //         error => console.log(error)
            //     )
        }
    }

    // fileChangeEvent(event) {
    //     console.log(event);
    // }

    submitSettings() {
        console.log('In submitSettings');
        // Combine the Form Model with our Data Model
         const combinedObject = Object.assign( {}, this.user, this.settingsForm.value);
        //         console.log( JSON.stringify( combinedObject ) );
        const uploadFile = (<HTMLInputElement>window.document.getElementById('avatar')).files[0];
        console.log(uploadFile);

        const formDataObject: FormData = new FormData();
        formDataObject.append('uploadFile', uploadFile, uploadFile.name);

   //     this.settingsForm.addControl( 'uploadFile' : uploadFile );
        console.log('This form value: ' + JSON.stringify( this.settingsForm.value ) );

        const myHeaders = new HttpHeaders();
        myHeaders.append('Content-Type', 'multipart/form-data');

        this._http.post('http://localhost:3100/api/avatar?userid='
            + this.currentUserId, this.settingsForm.value, {headers: myHeaders} ).subscribe(result => {
                console.log('Returned from avatar upload');
                        },
                    err => {
                        console.log('ERROR IN AVATAR UPLOAD');
                    });

    }
}
