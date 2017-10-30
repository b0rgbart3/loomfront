import { Component, OnInit } from '@angular/core';
import { ClassModel } from '../models/class.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CourseService } from '../courses/course.service';
import { Course } from '../models/course.model';
import { Material } from '../models/material.model';
import { MaterialService } from './material.service';
import { FileUploader } from 'ng2-file-upload';
const MATERIALS_IMAGE_PATH  = 'http://localhost:3100/materialimages/';
const MATERIALS_FILE_PATH  = 'http://localhost:3100/materialimages/';

@Component({
    moduleId: module.id,
    templateUrl: 'material-edit.component.html',
    styleUrls: ['material-edit.component.css']
})

export class MaterialEditComponent implements OnInit {
    material: Material = new Material ( '', '', '0', '', '', '', '', '');
    materialForm: FormGroup;
    types: Array<string>;
    id: string;
    errorMessage: string;
    thisFile: File;
    public imageUploader: FileUploader;
    public fileUploader: FileUploader;
    localImageUrl: string;
    tempName: string;
    image: string;
    imageUrl: string;
    file: string;
    fileUrl: string;

    constructor(private fb: FormBuilder, private activated_route: ActivatedRoute,
    private materialService: MaterialService, private router: Router ) {    }

    ngOnInit() {

        this.id = this.activated_route.snapshot.params['id'];

        if (this.id !== '0') {
            this.getMaterial(this.id);
         } else {
             this.id = this.materialService.getNextId();
             console.log('The highest ID we got back was: ' + this.id );
         }

        const urlWithQuery = 'http://localhost:3100/api/materialimages?id=' + this.id;
        this.imageUploader = new FileUploader({url: urlWithQuery});
        this.imageUploader.onAfterAddingFile = (fileItem) => {
            const url = (window.URL) ? window.URL.createObjectURL(fileItem._file)
                : (window as any).webkitURL.createObjectURL(fileItem._file);
            this.localImageUrl = url;
            // this.avatarimage = 'http://localhost:3100/public/avatars/' + this.currentUserId + '/' + ;
            // this.avatarimage = url;
            this.imageUploader.queue[0].upload();
            // console.log("Uploaded: " + JSON.stringify( fileItem._file ) );

        // this.courseForm.patchValue({'image': fileItem._file});
        };

        this.imageUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                        this.tempName = this.imageUploader.queue[0].file.name;
                        console.log('Response from the server: ' + this.tempName);


                         this.image = this.tempName;
                         this.imageUrl = MATERIALS_IMAGE_PATH + this.material.id + '/' + this.image;

                         console.log('Image url: ' + this.imageUrl);

                        // this.courseForm.patchValue({'image': this.image });
                         this.imageUploader.queue[0].remove();
                     };

        this.types = ['Book Reference', 'PDF document', 'video', 'webpage', 'audio file' ];
        this.materialForm = this.fb.group({
            title: [ '', [Validators.required, Validators.minLength(3)] ] ,
            description: [ '', []],
            contenturl: '',
            type: ['', [ ] ],
            imageUploader: '',
            fileUploader: '',
        });

        const fileurlWithQuery = 'http://localhost:3100/api/materialfiles?id=' + this.id;
        this.fileUploader = new FileUploader({url: fileurlWithQuery});
        this.fileUploader.onAfterAddingFile = (fileItem) => {
            const url = (window.URL) ? window.URL.createObjectURL(fileItem._file)
                : (window as any).webkitURL.createObjectURL(fileItem._file);
           // this.localImageUrl = url;
            // this.avatarimage = 'http://localhost:3100/public/avatars/' + this.currentUserId + '/' + ;
            // this.avatarimage = url;
            this.fileUploader.queue[0].upload();
            // console.log("Uploaded: " + JSON.stringify( fileItem._file ) );


        };

        this.fileUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                        this.tempName = this.fileUploader.queue[0].file.name;
                        console.log('Response from the server: ' + this.tempName);
                        this.file = this.tempName;
                        this.fileUrl = MATERIALS_FILE_PATH + this.material.id + '/' + this.file;

                         // this.image = this.tempName;
                         // this.imageUrl = MATERIALS_IMAGE_PATH + this.material.id + '/' + this.image;

                         console.log('Image url: ' + this.imageUrl);

                        // this.courseForm.patchValue({'image': this.image });
                         this.fileUploader.queue[0].remove();
                     };

    }

    getMaterial(id: string) {
        this.materialService.getMaterial(id).subscribe(
            material => { this.material = <Material>material[0];
                console.log('got material ' + id + ' info :' + JSON.stringify(material) );
                this.image = this.material.image;
                this.imageUrl = MATERIALS_IMAGE_PATH + '/' + this.material.id + '/' + this.image;
                this.file = this.material.file;
                this.fileUrl = MATERIALS_FILE_PATH + '/' + this.material.id + '/' + this.file;
                this.populateForm();
             },
            error => this.errorMessage = <any> error
        );
    }

    imageChange(event) {
        const fileList: FileList = event.target.files;
        if ( fileList.length > 0) {
            const file: File = fileList[0];
            console.log('Got a file: ' + file.name);
            this.thisFile = file;

        }
    }

    fileChange(event) {
        const fileList: FileList = event.target.files;
        if ( fileList.length > 0) {
            const file: File = fileList[0];
            console.log('Got a file: ' + file.name);
            this.thisFile = file;

        }
    }

    populateForm() {
        this.materialForm.patchValue({
        'title': this.material.title,
        'description': this.material.description,
        'contenturl': this.material.contenturl,
        'type': this.material.type
     });

        this.file = this.material.file;
        this.image = this.material.image;
    }

    postMaterial() {
        // this.material.image = this.image;
        this.material.image = this.image;
        this.material.file = this.file;

         // This is Deborah Korata's way of merging our data model with the form model
        const combinedObject = Object.assign( {}, this.material, this.materialForm.value);
        console.log( 'Posting material: ' + JSON.stringify( combinedObject ) );

        if (this.material.id === '0') {
            console.log('Creating material');
            this.materialService.createMaterial( combinedObject ).subscribe(
                (val) => {
                  },
                  response => {

                  },
                  () => {
                    this.router.navigate(['/admin']);
                  }
            );
        } else {
            // Validate stuff here
            this.materialService
            .updateMaterial( combinedObject ).subscribe(
            (val) => {

            },
            response => {

            },
            () => {

            this.router.navigate(['/admin']);
            }
        );
        }


    }
}
