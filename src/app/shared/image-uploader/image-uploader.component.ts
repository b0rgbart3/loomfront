// import { Component, OnInit, Input, Output } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
// import { Book } from '../../models/book.model';
// import { FileUploader } from 'ng2-file-upload';
// import { Globals } from '../../globals';
// import { EventEmitter } from '@angular/core';


// @Component({
//     moduleId: module.id,
//     selector: 'image-uploader',
//     templateUrl: 'image-uploader.component.html',
//     styleUrls: ['image-uploader.component.css']
// })

// export class ImageUploaderComponent implements OnInit {
//     imageUploaderForm: FormGroup;
//     id: string;
//     errorMessage: string;
//     thisFile: File;
//     public imageUploader: FileUploader;
//     localImageUrl: string;
//     tempName: string;
//     image: string;
//     imageUrl: string;

//     @Input() objectModel: any;
//     @Input() objectType: string;
//     @Input() objectPath: string;
//     @Input() urlWithQuery: string;
//     @Output() imageSelected = new EventEmitter <File>();

//     constructor( private globals: Globals, private fb: FormBuilder ) {    }

//     ngOnInit() {
//         this.imageUploaderForm = this.fb.group({
//             imageUploader: ''
//         });

//         this.imageUploader = new FileUploader({url: this.urlWithQuery});
//         this.imageUploader.onAfterAddingFile = (fileItem) => {
//             const url = (window.URL) ? window.URL.createObjectURL(fileItem._file)
//                 : (window as any).webkitURL.createObjectURL(fileItem._file);
//             this.localImageUrl = url;
//             console.log('Image uploader query url: ' + this.urlWithQuery);
//             this.imageUploader.queue[0].upload();
//         };

//         this.imageUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
//                         this.tempName = this.imageUploader.queue[0].file.name;
//                         console.log('Response from the server: ' + this.tempName);


//                          this.image = this.tempName;
//                          this.imageUrl = this.objectPath + '/' + this.objectModel.id + '/' +
//                           this.image;

//                          console.log('Image url: ' + this.imageUrl);
//                          this.imageUploader.queue[0].remove();
//                      };
//     }


//     imageChange(event) {
//         const fileList: FileList = event.target.files;
//         if ( fileList.length > 0) {
//             const file: File = fileList[0];
//             console.log('Got a file: ' + file.name);
//             this.thisFile = file;
//             this.imageSelected.emit( file );

//         }
//     }

// }
