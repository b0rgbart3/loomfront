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
import { Usersettings } from '../../models/usersettings.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, DoCheck } from '@angular/core';


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
    tempName: string;
    usersettings: Usersettings;
    favoritecolor: FormControl;
    avatarInput: FormControl;
    currentUserId;
    avatarobject: Avatar;
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
        private authenticationService: AuthenticationService,
        private activated_route: ActivatedRoute,
        private sanitizer: DomSanitizer) {}

    myInit() {
        this.user = this.authenticationService.loggedInUser();
        this.currentUserId = localStorage.getItem('id');
        // this.currentAvatar = null;
        // this.currentAvatarFile = null;
        this.avatarobject = this.authenticationService.avatar;
        this.avatarimage = localStorage.getItem('avatarimage');
        console.log('In user settings init User: ' + JSON.stringify ( this.user));
        console.log('id: ' + this.currentUserId);
//        this.avatarimage = this.authenticationService.avatarimage;

    }
    ngOnInit () {
        this.favoritecolor = new FormControl();
        this.avatarInput = new FormControl();
        this.settingsForm = new FormGroup ( {
            favoritecolor: this.favoritecolor,
            avatar: this.avatarInput
        } );

        this.myInit();
        this.userService.getUsersettings(this.currentUserId).subscribe(
            usersettings =>  {
                console.log('Got User Settings for ' + this.currentUserId + ': ' + JSON.stringify(usersettings) );
                this.usersettings = usersettings[0]; this.populateForm(); },
            error => this.errorMessage = <any>error);


        const urlWithQuery = 'http://localhost:3100/api/avatar?userid=' + this.currentUserId;
        this.uploader = new FileUploader({url: urlWithQuery});
        this.uploader.onAfterAddingFile = (fileItem) => {
            const url = (window.URL) ? window.URL.createObjectURL(fileItem._file)
                : (window as any).webkitURL.createObjectURL(fileItem._file);
            this.localImageUrl = url;
            // this.avatarimage = 'http://localhost:3100/public/avatars/' + this.currentUserId + '/' + ;
            // this.avatarimage = url;
            this.uploader.queue[0].upload();
         };
         this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            

            this.authenticationService.loadAvatar();
            this.tempName = this.uploader.queue[0].file.name;
            
            const newfilename = 'avatar.' + this.tempName.split('.')[this.tempName.split('.').length - 1];
            console.log("New name: "+ newfilename);
            this.avatarimage = 'http://localhost:3100/avatars/' + this.currentUserId + '/' + newfilename;

            localStorage.setItem('avatarimage', this.avatarimage);
            
            this.uploader.queue[0].remove();
        };

        this.favoritecolor.valueChanges.subscribe( value => console.log(value) );
        this.avatarInput.valueChanges.subscribe( value => console.log('value change: ' + value) );
        // this.populateForm();

        console.log('At the end of the user settings init method: the avatarimage = ' + this.avatarimage );
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

    populateForm(): void {
        console.log('Populating the form with: ' + JSON.stringify(this.usersettings) );

        if (this.usersettings) {
            this.favoritecolor.patchValue(this.usersettings.favoritecolor);

       // this.settingsForm.patchValue({'favoritecolor': this.usersettings.favoritecolor });
        }
        // this.avatarobject = this.authenticationService.avatar;
        // this.avatarimage = this.authenticationService.avatarimage;


    }

    submitSettings() {
        console.log('In submitSettings');
        // Combine the Form Model with our Data Model

        let superObject = {};
        if ( this.settingsForm.value.favoritecolor ) {
         superObject = {'id': this.currentUserId , 'favoritecolor': this.settingsForm.value.favoritecolor }; } else {
             superObject = {'id': this.currentUserId  };        }

         console.log(JSON.stringify(superObject));
        this.userService.saveSettings( superObject ).subscribe(
            (val) => {
                console.log('POST call successful value returned in body ', val);
              },
              response => {
                console.log('POST call in error', response);
              },
              () => {
                console.log('The POST observable is now completed.');
              //   this.alertService.success('Thank you for registering with the Reclaiming Loom. ' +
              //   ' Now, please check your email, and use the verification code to verify your account.  Thank you.', true);
              //   // this._flashMessagesService.show('Username or password was incorrect.',
                // { cssClass: 'alert-warning', timeout: 7000 });
                this.router.navigate(['/admin']);
              }
        );


    }


}
