import { Component, OnInit } from '@angular/core';
import { Asset } from '../models/Asset.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { AssetService } from './asset.service';
// import { FileUploader } from 'ng2-file-upload';
import { NgClass, NgStyle} from '@angular/common';
import { Uploader } from 'angular2-http-file-upload';
import { MyUploadItem } from '../../my-upload-item';
import { HttpHeaders } from '@angular/common/http';


// const URL = '/api/';
const URL = 'http://localhost:3100/api/assets';


@Component({
    moduleId: module.id,
    templateUrl: 'upload.component.html',
    styleUrls: ['upload.component.css'],
})

export class UploadComponent implements OnInit {

    thisFile: File;
    AssetForm: FormGroup;
    asset: Asset;
    id: string;
    errorMessage: string;
    myStart: Date;
    myEnd: Date;
    assets: Asset [];

     courseSelections = [

    ];
    // public uploader: FileUploader = new FileUploader({url: URL});
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
        private assetService: AssetService,
        private router: Router,
        public uploaderService: Uploader) {   }

    ngOnInit(): void {
        console.log('Upload Component ngOnInit.');

        this.asset = new Asset('', '', '', '', '', '', '', '', '', '' );
        let id = +this.activated_route.snapshot.params['id'];

        if (!id) { id = 0; }
        if (id !== 0) {
            this.getAsset(id);
         }
         console.log('ID: ' + id);
        // this.assetService.getAssets().subscribe( assets => { this.assets = assets; },
        //   error => this.errorMessage = <any>error);
    }

    getAsset(id: number) {
        this.assetService.getAsset(id).subscribe(
            Assetobject => {this.asset = <Asset>Assetobject[0]; console.log('got Asset info :' +
                            JSON.stringify(Assetobject) );

                           // console.log('Getting the Asset Object: ' + JSON.stringify( this.thisAsset ) );
                           // this.populateForm();
                         },
            error => this.errorMessage = <any> error
        );
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

    save(form): void {

       const uploadFile = (<HTMLInputElement>window.document.getElementById('myFileInputField')).files[0];
       console.log(uploadFile);

        // const myUploadItem = new MyUploadItem(uploadFile);
        // myUploadItem.formData = { FormDataKey: 'Form Data Value' };  // (optional) form data can be sent with file

        // // let headers = new HttpHeaders();
        // // headers.append('Content-Type', 'application/json');

        // this.uploaderService.onSuccessUpload = (item, response, status, headers) => {
        //     // success callback
        // };
        // this.uploaderService.onErrorUpload = (item, response, status, headers) => {
        //     // error callback
        // };
        // this.uploaderService.onCompleteUpload = (item, response, status, headers) => {
        //     // complete callback, called regardless of success or failure
        // };
        // this.uploaderService.upload(myUploadItem);
       // console.log('In Asset-Edit component, about to savemodel: ' + JSON.stringify(form.value)  );

        // console.log(JSON.stringify( this.thisFile) );
        //     // This is Deborah Korata's way of merging our data model with the form model
        //      const combinedAssetObject = Object.assign( {}, this.asset, form.value);
        //      combinedAssetObject.file = this.thisFile;

        this.assetService.createAsset( uploadFile ).subscribe(
                            (val) => {
                                console.log('POST call successful value returned in body ', val);
                              },
                              response => {
                               console.log('POST call in error', response);
                              },
                              () => {
                                console.log('POST call completed. ');
                               // this.router.navigate(['/admin']);
                              }
        );

        //      console.log('Combined Asset Object: ' + JSON.stringify(combinedAssetObject) );
        //   //  console.log('In Asset-Edit component, saving model');
        //     if (this.asset.id === '0') {
        //         this.assetService.createAsset( combinedAssetObject ).subscribe(
        //         // this.AssetService.createAsset( combinedAssetObject ).subscribe(
        //             (val) => {
        //             //    console.log('POST call successful value returned in body ', val);
        //               },
        //               response => {
        //             //    console.log('POST call in error', response);
        //               },
        //               () => {
        //                 this.router.navigate(['/admin']);
        //               }
        //         );
        //     } else {
        //         // Validate stuff here
        //        console.log('About to update Asset.');
        //        console.log(combinedAssetObject);
        //         this.assetService
        //         .updateAsset( combinedAssetObject ).subscribe(
        //         (val) => {
        //        // console.log('POST call successful value returned in body ', val);
        //         },
        //         response => {
        //       //  console.log('POST call in error', response);
        //         },
        //         () => {
        //         this.router.navigate(['/admin']);
        //         });
        //     }
    }



    onSaveComplete(): void {
        this.AssetForm.reset();
        this.router.navigate(['/admin']);
    }
}

