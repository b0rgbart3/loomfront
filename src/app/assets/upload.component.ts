import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { FileUploader } from 'ng2-file-upload';
import { NgClass, NgStyle} from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { UserService } from '../services/user.service';

// const URL = '/api/';
// let uploadURL = 'http://localhost:3100/api/assets';

@Component({
    moduleId: module.id,
    templateUrl: 'upload.component.html',
    styleUrls: ['upload.component.css'],
})

export class UploadComponent implements OnInit {

    thisFile: File;
    AssetForm: FormGroup;

    id: string;
    errorMessage: string;
    myStart: Date;
    myEnd: Date;

    userId: string;

     courseSelections = [

    ];


    public uploader: FileUploader;
    public hasBaseDropZoneOver = false;
    public hasAnotherDropZoneOver = false;
    public fileOverBase(e: any): void {
      this.hasBaseDropZoneOver = e;
    }
    public fileOverAnother(e: any): void {
      this.hasAnotherDropZoneOver = e;
    }

    constructor(
        private activated_route: ActivatedRoute,
   
        private router: Router,
        private userService: UserService) {   }

    ngOnInit(): void {

        const currentUserId = this.userService.getUserId();
        const urlWithQuery = 'http://localhost:3100/api/assets?userid=' + currentUserId;

        this.uploader = new FileUploader({url: urlWithQuery});

       // this.asset = new Asset( '', '', '', '', '', '', '', '', '', '' );
        let id = +this.activated_route.snapshot.params['id'];

        if (!id) { id = 0; }
        if (id !== 0) {
            // this.getAsset(id);
         }

        // this.assetService.getAssets().subscribe( assets => { this.assets = assets; },
        //   error => this.errorMessage = <any>error);
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

   


    onSaveComplete(): void {
        this.AssetForm.reset();
        this.router.navigate(['/admin']);
    }
}

