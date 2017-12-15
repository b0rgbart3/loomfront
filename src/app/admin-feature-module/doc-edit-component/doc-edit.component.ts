import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { Globals } from '../../globals';
import { Doc } from '../../models/doc.model';
import { DocService } from '../../services/doc.service';

@Component({
    moduleId: module.id,
    templateUrl: 'doc-edit.component.html',
    styleUrls: ['doc-edit.component.css']
})

export class DocEditComponent implements OnInit {
    doc: Doc = new Doc ( '', '', '', '', '', '', '', '', '');
    id: string;
    errorMessage: string;
    docForm: FormGroup;
    imageUploader: FileUploader;
    public fileUploader: FileUploader;
    localImageUrl: string;
    tempName: string;
    image: string;
    imageUrl: string;

    file: string;
    fileUrl: string;

    constructor(private fb: FormBuilder, private activated_route: ActivatedRoute,
        private router: Router,
        private globals: Globals,
    private docService: DocService ) {    }

    ngOnInit() {

        this.id = this.activated_route.snapshot.params['id'];

                if (this.id !== '0') {
                    this.getDoc(this.id);
                 } else {
                     this.id = this.docService.getNextId();
                     this.doc.id = this.id;
                     console.log('The highest ID we got back was: ' + this.id );
                 }

                const urlWithQuery = this.globals.postdocimages + '?id=' + this.id;

                console.log('urlquery for doc image upload: ' + urlWithQuery);

                this.imageUploader = new FileUploader({url: urlWithQuery});
                this.imageUploader.onAfterAddingFile = (fileItem) => {
                    const url = (window.URL) ? window.URL.createObjectURL(fileItem._file)
                        : (window as any).webkitURL.createObjectURL(fileItem._file);
                    this.localImageUrl = url;
                    this.imageUploader.queue[0].upload();
                };

                this.imageUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                                this.tempName = this.imageUploader.queue[0].file.name;
                                console.log('Response from the server: ' + this.tempName);


                                 this.image = this.tempName;
                                 this.imageUrl = this.globals.docimages + '/' + this.doc.id + '/' + this.image;

                                 console.log('Image url: ' + this.imageUrl);
                                 this.imageUploader.queue[0].remove();
                             };

                   this.docForm = this.fb.group({
                    title: [ '', [Validators.required, Validators.minLength(3)] ] ,
                    description: [ '', []],
                    author: ['', []],
                    purchaseURL: '',
                    imageUploader: '',
                    fileUploader: ''
                });

                const fileurlWithQuery = this.globals.postdocfiles + '?id=' + this.id;
        this.fileUploader = new FileUploader({url: fileurlWithQuery});
        this.fileUploader.onAfterAddingFile = (fileItem) => {
            const url = (window.URL) ? window.URL.createObjectURL(fileItem._file)
                : (window as any).webkitURL.createObjectURL(fileItem._file);

            this.fileUploader.queue[0].upload();


        };

    }

    getDoc(id: string) {
        this.docService.getDoc(id).subscribe(
            doc => { this.doc = <Doc>doc[0];
                console.log('got document ' + id + ' info :' + JSON.stringify( doc) );
                this.image = this.doc.image;
                this.imageUrl = this.globals.docimages + '/' + this.doc.id + '/' + this.image;
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
            this.image = file.name;

        }
    }


    populateForm() {
        this.docForm.patchValue({
        'title': this.doc.title,
        'description': this.doc.description,
        'author': this.doc.author
     });

        this.image = this.doc.image;
        this.file = this.doc.file;

    }

    fileChange(event) {
        const fileList: FileList = event.target.files;
        if ( fileList.length > 0) {
            const file: File = fileList[0];
            console.log('Got a file: ' + file.name);
            this.file = file.name;

        }
    }

    postDoc() {
        this.doc.image = this.image;
        this.doc.file = this.file;

        console.log('posting Doc, with ID of: ' + this.doc.id);

         // This is Deborah Korata's way of merging our data model with the form model
        const combinedObject = Object.assign( {}, this.doc, this.docForm.value);
        console.log( 'Posting material: ' + JSON.stringify( combinedObject ) );

        if (this.doc.id === '0') {
            console.log('Creating document');
            this.docService.createDoc( combinedObject ).subscribe(
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
            this.docService
            .updateDoc( combinedObject ).subscribe(
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

    deleteDoc() {
        const result = confirm( 'Warning! \n\nAre you sure you want to delete this pdf document: ' +
        this.doc.title + ', and it\'s info from the database?' +
        ' width ID: ' + this.doc.id + '? ');
        if (result) {
            console.log('Got the ok to delete the document.');

        this.docService.deleteDoc( this.doc.id ).subscribe(
            (data) => {
                console.log('Got back from the Doc Service.');
                this.router.navigate(['/coursebuilder']);
            },
          error => {
              this.errorMessage = <any>error;
              // This is a work-around for a HTTP error message I was getting even when the
              // course was successfully deleted.
              if (error.status === 200) {
                console.log('Got back from the Doc Service.');
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
