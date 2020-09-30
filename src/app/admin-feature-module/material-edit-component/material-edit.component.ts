import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ClassModel } from '../../models/class.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { Material } from '../../models/material.model';
import { MaterialService } from '../../services/material.service';
//import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload/ng2-file-upload';
import { FileUploader } from 'ng2-file-upload';
import { Globals } from '../../globals2';
import {Location} from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'material-edit',
    templateUrl: 'material-edit.component.html',
    styleUrls: ['material-edit.component.css']
})

export class MaterialEditComponent implements OnInit {
    @Input() newType: string;
    @Input() passedMaterialObject: Material;
    @Output() onComplete= new EventEmitter <Material>();
    modalVersion: boolean;
    material: Material = new Material ( '', '', '0', '', '', '', '', '', '', '', '', false);
    materialForm: FormGroup;
    type: string;
    // types: Array<string>;
    id: string;
    errorMessage: string;
    thisFile: File;
    imageUploader: FileUploader;
    imageUploaded: boolean;
    public fileUploader: FileUploader;
    fileUploaded: boolean;
    localImageUrl: string;
    tempName: string;
    image: string;
    imageUrl: string;
    file: string;
    fileUrl: string;
    urlLabel: string;
    urlNeeded: boolean;
    uploaderNeeded: boolean;
    descriptionPlaceholder: string;
    contentPlaceholder: string;
    includeimagestring: string;
    descriptionNeeded: boolean;
    contentNeeded: boolean;
    lengthNeeded: boolean;
    maxFileSize = 5 * 1024 * 1024;
    loading: boolean;
    displayModal: boolean;

    constructor(private fb: FormBuilder,
    private activated_route: ActivatedRoute,
    private materialService: MaterialService,
    private router: Router,
    private globals: Globals,
    private _location: Location  ) {    }

    isDirty() {
// console.log('checking dirty status');
        if (this.imageUploaded) {
   //         console.log('image was uploaded.');
            return true;
        }
        if (this.fileUploaded) {
     //       console.log('file was uploaded.');
            return true;
        }
        if (this.materialForm.dirty) {
       //     console.log('courseFormGroup was dirty');
            return true;
        }

        if (this.imageUploaded || this.fileUploaded) {
            return true;
        }


        return false;
    }

    ngOnInit() {
        this.displayModal = false;
        this.loading = false;
        this.includeimagestring = 'Include Image';
        this.imageUploaded = false;
        this.fileUploaded = false;
        // This gets the resource type from the router, as a data parameter
        // which we will use to dynamically
        // change our Form Model to accommodate the resource type
        // First we check to see if this is being called as a Modal - and we can tell
        // by weather or not the newType Input var is set.
        if (this.newType) {
            this.modalVersion = true;
        //    console.log('found a new Type: ' + this.newType);
            this.type = this.newType;
            console.log('ASSIGNING MATERIAL OBJECT: ' + JSON.stringify(this.passedMaterialObject));
            this.material = this.passedMaterialObject;
            if (this.material.image !== '') {
                this.includeimagestring = 'Change Image';
            }
        } else {
                this.modalVersion = false;
        this.type = this.activated_route.snapshot.data['type'];
        }
        switch (this.type) {
            case 'book':
            this.urlLabel = 'Purchase URL';
            this.uploaderNeeded = false;
            this.descriptionPlaceholder = 'Description';
            this.urlNeeded = true;
            this.descriptionNeeded = true;
            this.contentNeeded = false;
            this.lengthNeeded = true;
            break;
            case 'quote':
            this.uploaderNeeded = false;
            this.contentNeeded = true;
            this.contentPlaceholder = 'Quotation';
            this.descriptionNeeded = false;
            this.urlNeeded = false;
            this.lengthNeeded = false;
            break;
            case 'block':
            this.uploaderNeeded = false;
            this.descriptionNeeded = false;
            this.urlNeeded = false;
            this.contentPlaceholder = 'HTML Block';
            this.contentNeeded = true;
            this.lengthNeeded = false;
            break;
            case 'image':
            this.lengthNeeded = false;
            break;
            default: this.urlLabel = 'URL';
            this.uploaderNeeded = true;
            this.descriptionNeeded = true;
            this.lengthNeeded = true;
            this.descriptionPlaceholder = 'Description';
            break;
        }

        if (this.modalVersion) {// this.id = '0';
        // this.material.id = this.id;
        this.id = this.material.id;
       } else {
        this.id = this.activated_route.snapshot.params['id'];
        this.material.id = this.id;
        }



        console.log('This material id: ' + this.id);
        if (this.id !== '0') {
            this.getMaterial(this.id);
         } else {
            //  this.id = this.materialService.getNextId();
            //  this.material.id = this.id;
            //  console.log('the ID we got was: ' + this.id);
         }
         this.buildForm();


    }

    private formatBytes(bytes, decimals?) {
        if (bytes === 0) { return '0 Bytes'; }
        const k = 1024,
          dm = decimals || 2,
          sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
          }

    buildForm() {
        const urlWithQuery = this.globals.postmaterialimages + '?id=' + this.id;
        this.imageUploader = new FileUploader({url: urlWithQuery, maxFileSize: this.maxFileSize});

        this.imageUploader.onAfterAddingFile = (fileItem) => {
            this.imageUploaded = true;
            // const url = (window.URL) ? window.URL.createObjectURL(fileItem._file)
            //     : (window as any).webkitURL.createObjectURL(fileItem._file);
            // this.localImageUrl = url;
            // console.log('In build form: onAfterAddingFile: url =' + url);
            this.imageUploader.queue[0].upload();

        };

        this.imageUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                        this.tempName = this.imageUploader.queue[0].file.name;
                     //    console.log('Response from the server: ' + this.tempName);
                         this.image = this.tempName;
                         this.imageUrl = this.globals.materialimages + '/' +
                          this.material.id + '/' + this.image;
                      //   console.log('Image url: ' + this.imageUrl);
                         this.imageUploader.queue[0].remove();

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

        this.materialForm = this.fb.group({
            title: [ '', [Validators.required, Validators.minLength(3)] ] ,
            description: [ '', []],
            contenturl: '',
            imageUploader: '',
            fileUploader: '',
            content: '',
            author: '',
            length: ''
        });

        const fileurlWithQuery = this.globals.postmaterialfiles + '?id=' + this.id;
        this.fileUploader = new FileUploader({url: fileurlWithQuery});
        this.fileUploader.onAfterAddingFile = (fileItem) => {
            this.fileUploaded = true;
            // const url = (window.URL) ? window.URL.createObjectURL(fileItem._file)
            //     : (window as any).webkitURL.createObjectURL(fileItem._file);
            // console.log('About to upload');
             this.fileUploader.queue[0].upload();
            // console.log('Upload request sent');
        };

        this.fileUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                   //     console.log('About to assign tempName');
                        this.tempName = this.fileUploader.queue[0].file.name;
                   //     console.log('Response from the server: ' + this.tempName);
                        this.file = this.tempName;
                        this.loading = false;
                        this.fileUrl = this.globals.materialfiles + '/' + this.material.id + '/' + this.file;
                   //     console.log('File url: ' + this.fileUrl);
                         this.fileUploader.queue[0].remove();

                     };
    }

    getMaterial(id: string) {
        this.materialService.getMaterial(id).subscribe(
            material => { this.material = <Material>material[0];
           //     console.log('got material ' + id + ' info :' + JSON.stringify(material) );
                this.image = this.material.image;
                if (this.material.image !== '') {
                    this.includeimagestring = 'Change Image';
                }
                if (this.image) {
                //    console.log('including an image with this material');
                  this.imageUrl = this.globals.materialimages + '/' + this.material.id + '/' + this.image;
                } else { this.imageUrl = null; }
                this.file = this.material.file;
                this.fileUrl = this.globals.materialfiles + '/' + this.material.id + '/' + this.file;
                this.populateForm();
             },
            error => this.errorMessage = <any> error
        );
    }

    imageChange(event) {
        const fileList: FileList = event.target.files;
        if ( fileList.length > 0) {
            const file: File = fileList[0];
           // console.log('Got a file: ' + file.name);
            this.thisFile = file;

        }
    }

    fileChange(event) {
        this.loading = true;
        console.log('File changed.');
        const fileList: FileList = event.target.files;
        if ( fileList.length > 0) {
            const file: File = fileList[0];

            this.thisFile = file;
            console.log('Got a file: ' + file.name);
        }
    }

    populateForm() {
        this.materialForm.patchValue({
        'title': this.material.title,
        'description': this.material.description,
        'contenturl': this.material.contenturl,
        'type': this.material.type,
        'content': this.material.content,
        'author': this.material.author,
        'length': this.material.length
     });

        this.file = this.material.file;
        this.image = this.material.image;
    }

    postMaterial() {
        // this.material.image = this.image;
        this.material.image = this.image;
        this.material.file = this.file;
        this.material.type = this.type;
        // if (this.type === 'quote') {
        //     console.log('posting a quotation: ' + this.materialForm.value['content']);
        //     this.materialForm.patchValue({'title': this.materialForm.value['content'].substring(0, 80) + '...' });
        // }

         // This is Deborah Korata's way of merging our data model with the form model
        const combinedObject = Object.assign( {}, this.material, this.materialForm.value);
       // console.log( 'Posting material: ' + JSON.stringify( combinedObject ) );

       // I don't need to store these in the database
       delete combinedObject.imageUploader;
       delete combinedObject.fileUploader;

        if (this.material.id === '0') {
           // console.log('Creating material');
            this.materialService.createMaterial( combinedObject ).subscribe(
                (val) => {
                  },
                  response => {
                   // this.router.navigate(['/admin/materials']);
                  },
                  () => {
               //       console.log('Done creating new material.');
                      if (!this.modalVersion) {
                          this.materialForm.reset();
                          this.imageUploaded = false; // just to reset it
                          this.fileUploaded = false;
                    this.router.navigate(['/admin/materials']); } else {
                        this.material = combinedObject;
                        this.complete();
                    }
                  }
            );
        } else {
            // Validate stuff here
            this.materialService
            .updateMaterial( combinedObject ).subscribe(
            (val) => {
            //    console.log('The current material model is: ' + JSON.stringify(this.material));
                this.material = val;
              //  console.log('Reassigning the material model to: ' + JSON.stringify(val));
            },
            response => {
              //  this.router.navigate(['/admin/materials']);
            },
            () => {
                if (!this.modalVersion) {
            this.router.navigate(['/admin/materials']);
            this.materialForm.reset();
            this.imageUploaded = false; // just to reset it
            this.fileUploaded = false;
        } else {
                this.complete();
            }
            }
        );
        }


    }


    deleteMaterial() {
        const result = confirm( 'Warning! \n\nAre you sure you want to delete this' +
        this.type + ' : ' + this.material.title + ', and all of it\'s related data from the database?' +
        ' width ID: ' + this.material.id + '? ');
        if (result) {
      //      console.log('Got the ok to delete the book.');

        this.materialService.deleteMaterial( this.material.id ).subscribe(
            (data) => {
                console.log('Got back from the Book Service.');
                this.router.navigate(['/admin/materials']);
            },
          error => {
              this.errorMessage = <any>error;
              // This is a work-around for a HTTP error message I was getting even when the
              // course was successfully deleted.
              if (error.status === 200) {
        //        console.log('Got back from the Course Service.');
                this._location.back();
               // this.router.navigate(['/coursebuilder']);
              } else {
             console.log('Error: ' + JSON.stringify(error) ); }
        } );
       }
      }

      remove() {
        const result = confirm( 'Are you sure you want to remove this ,' +
    this.material.type + ' and ALL of it\'s data, with ID: ' + this.material.id + '? ');

    if (result) {
        this.materialService.remove( this.material).subscribe( (val) => {
            this.router.navigate(['/admin/materials']);
        }, response => { this.router.navigate(['/admin/materials']); },
            () => { });
      }
    }

    closer() {
        this.router.navigate(['/admin/materials']);
    }

    complete() {
        console.log('onComplete in Material edit, Im emitting this material: ' + JSON.stringify(this.material));
        this.onComplete.emit(this.material);
    }

    openModal() {
        this.displayModal = true;
    }
    closeModal() {
        this.displayModal = false;
    }

}
