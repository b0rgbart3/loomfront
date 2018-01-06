import { Component, OnInit } from '@angular/core';
import { ClassModel } from '../../models/class.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CourseService } from '../../courses/course.service';
import { Course } from '../../models/course.model';
import { Material } from '../../models/material.model';
import { MaterialService } from '../../services/material.service';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Globals } from '../../globals';

@Component({
    moduleId: module.id,
    templateUrl: 'material-edit.component.html',
    styleUrls: ['material-edit.component.css']
})

export class MaterialEditComponent implements OnInit {
    material: Material = new Material ( '', '', '0', '', '', '', '', '', '', '', '', '', '');
    materialForm: FormGroup;
    type: string;
    // types: Array<string>;
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
    urlLabel: string;
    urlNeeded: boolean;
    uploaderNeeded: boolean;
    descriptionPlaceholder: string;
    contentPlaceholder: string;
    descriptionNeeded: boolean;
    contentNeeded: boolean;

    constructor(private fb: FormBuilder,
    private activated_route: ActivatedRoute,
    private materialService: MaterialService,
    private router: Router,
    private globals: Globals ) {    }

    ngOnInit() {

        // This gets the resource type from the router, as a data parameter
        // which we will use to dynamically
        // change our Form Model to accommodate the resource type
        this.type = this.activated_route.snapshot.data['type'];

        switch (this.type) {
            case 'book':
            this.urlLabel = 'Purchase URL';
            this.uploaderNeeded = false;
            this.descriptionPlaceholder = 'Description';
            this.urlNeeded = true;
            this.descriptionNeeded = true;
            this.contentNeeded = false;
            break;
            case 'quote':
            this.uploaderNeeded = false;
            this.contentNeeded = true;
            this.contentPlaceholder = 'Quotation';
            this.descriptionNeeded = false;
            this.urlNeeded = false;
            break;
            case 'block':
            this.uploaderNeeded = false;
            this.descriptionNeeded = false;
            this.urlNeeded = false;
            this.contentPlaceholder = 'HTML Block';
            this.contentNeeded = true;
            break;
            default: this.urlLabel = 'URL';
            this.uploaderNeeded = true;
            this.descriptionNeeded = true;
            this.descriptionPlaceholder = 'Description';
            break;
        }
        this.id = this.activated_route.snapshot.params['id'];
        this.material.id = this.id;

        if (this.id !== '0') {
            this.getMaterial(this.id);
         } else {
             this.id = this.materialService.getNextId();
             this.material.id = this.id;
             console.log('the ID we got was: ' + this.id);
         }
         this.buildForm();
    }

    buildForm() {
        const urlWithQuery = this.globals.postmaterialimages + '?id=' + this.id;
        this.imageUploader = new FileUploader({url: urlWithQuery});
        this.imageUploader.onAfterAddingFile = (fileItem) => {
            const url = (window.URL) ? window.URL.createObjectURL(fileItem._file)
                : (window as any).webkitURL.createObjectURL(fileItem._file);
            this.localImageUrl = url;

            this.imageUploader.queue[0].upload();

        };

        this.imageUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                        this.tempName = this.imageUploader.queue[0].file.name;
                     //    console.log('Response from the server: ' + this.tempName);
                         this.image = this.tempName;
                         this.imageUrl = this.globals.materialimages + '/' + this.material.id + '/' + this.image;
                      //   console.log('Image url: ' + this.imageUrl);
                         this.imageUploader.queue[0].remove();
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
            const url = (window.URL) ? window.URL.createObjectURL(fileItem._file)
                : (window as any).webkitURL.createObjectURL(fileItem._file);
            console.log('About to upload');
            this.fileUploader.queue[0].upload();
            console.log('Upload request sent');
        };

        this.fileUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                        this.tempName = this.fileUploader.queue[0].file.name;
                        console.log('Response from the server: ' + this.tempName);
                        this.file = this.tempName;
                        this.fileUrl = this.globals.postmaterialfiles + '/' + this.material.id + '/' + this.file;
                        console.log('Image url: ' + this.imageUrl);
                         this.fileUploader.queue[0].remove();
                     };
    }

    getMaterial(id: string) {
        this.materialService.getMaterial(id).subscribe(
            material => { this.material = <Material>material[0];
                console.log('got material ' + id + ' info :' + JSON.stringify(material) );
                this.image = this.material.image;
                if (this.image) {
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
        console.log('File changed.');
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
        if (this.type === 'quote') {
            console.log('posting a quotation: ' + this.materialForm.value['content']);
            this.materialForm.patchValue({'title': this.materialForm.value['content'].substring(0, 80) + '...' });
        }

         // This is Deborah Korata's way of merging our data model with the form model
        const combinedObject = Object.assign( {}, this.material, this.materialForm.value);
       // console.log( 'Posting material: ' + JSON.stringify( combinedObject ) );

        if (this.material.id === '0') {
           // console.log('Creating material');
            this.materialService.createMaterial( combinedObject ).subscribe(
                (val) => {
                  },
                  response => {
                    this.router.navigate(['/coursebuilder']);
                  },
                  () => {
                    this.router.navigate(['/coursebuilder']);
                  }
            );
        } else {
            // Validate stuff here
            this.materialService
            .updateMaterial( combinedObject ).subscribe(
            (val) => {
            },
            response => {
                this.router.navigate(['/coursebuilder']);
            },
            () => {
            this.router.navigate(['/coursebuilder']);
            }
        );
        }


    }


    deleteMaterial() {
        const result = confirm( 'Warning! \n\nAre you sure you want to delete this' +
        this.type + ' : ' + this.material.title + ', and all of it\'s related data from the database?' +
        ' width ID: ' + this.material.id + '? ');
        if (result) {
            console.log('Got the ok to delete the book.');

        this.materialService.deleteMaterial( this.material.id ).subscribe(
            (data) => {
                console.log('Got back from the Book Service.');
                this.router.navigate(['/coursebuilder']);
            },
          error => {
              this.errorMessage = <any>error;
              // This is a work-around for a HTTP error message I was getting even when the
              // course was successfully deleted.
              if (error.status === 200) {
                console.log('Got back from the Course Service.');
                this.router.navigate(['/coursebuilder']);
              } else {
             console.log('Error: ' + JSON.stringify(error) ); }
        } );
       }
      }


    closeMe() {
        this.router.navigate(['/coursebuilder']);
    }
}
