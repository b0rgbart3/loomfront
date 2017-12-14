import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import { FileUploader } from 'ng2-file-upload';
import { Globals } from '../../globals';


@Component({
    moduleId: module.id,
    templateUrl: 'book-edit.component.html',
    styleUrls: ['book-edit.component.css']
})

export class BookEditComponent implements OnInit {
    book: Book = new Book ( '', '', '', '', '', '', '', '' );
    bookForm: FormGroup;
    types: Array<string>;
    id: string;
    errorMessage: string;
    thisFile: File;
    public imageUploader: FileUploader;
    localImageUrl: string;
    tempName: string;
    image: string;
    imageUrl: string;

    constructor(private fb: FormBuilder, private activated_route: ActivatedRoute,
    private bookService: BookService, private router: Router, private globals: Globals ) {    }

    ngOnInit() {

        this.id = this.activated_route.snapshot.params['id'];

        if (this.id !== '0') {
            this.getBook(this.id);
         } else {
             this.id = this.bookService.getNextId();
             this.book.id = this.id;
             console.log('The highest ID we got back was: ' + this.id );
         }

        const urlWithQuery = this.globals.postbookimages + '?id=' + this.id;
        console.log('urlquery for book image upload: ' + urlWithQuery);
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
                         this.imageUrl = this.globals.bookimages + '/' + this.book.id + '/' + this.image;

                         console.log('Image url: ' + this.imageUrl);
                         this.imageUploader.queue[0].remove();
                     };

        this.types = ['Book Reference', 'PDF document', 'video', 'webpage', 'audio file' ];
        this.bookForm = this.fb.group({
            title: [ '', [Validators.required, Validators.minLength(3)] ] ,
            description: [ '', []],
            author: ['', []],
            purchaseURL: '',
            imageUploader: ''
        });


    }

    getBook(id: string) {
        this.bookService.getBook(id).subscribe(
            book => { this.book = <Book>book[0];
                console.log('got book ' + id + ' info :' + JSON.stringify(book) );
                this.image = this.book.image;
                this.imageUrl = this.globals.bookimages + '/' + this.book.id + '/' + this.image;
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


    populateForm() {
        this.bookForm.patchValue({
        'title': this.book.title,
        'description': this.book.description,
        'purchaseURL': this.book.purchaseURL,
        'author': this.book.author
     });

        this.image = this.book.image;
    }

    postBook() {
        this.book.image = this.image;

        console.log('posting Book, with ID of: ' + this.book.id);

         // This is Deborah Korata's way of merging our data model with the form model
        const combinedObject = Object.assign( {}, this.book, this.bookForm.value);
        console.log( 'Posting material: ' + JSON.stringify( combinedObject ) );

        if (this.book.id === '0') {
            console.log('Creating material');
            this.bookService.createBook( combinedObject ).subscribe(
                (val) => {
                  },
                  response => {
                    this.router.navigate(['/admin']);
                  },
                  () => {
                    this.router.navigate(['/admin']);
                  }
            );
        } else {
            // Validate stuff here
            this.bookService
            .updateBook( combinedObject ).subscribe(
            (val) => {

            },
            response => {
                this.router.navigate(['/admin']);
            },
            () => {

            this.router.navigate(['/admin']);
            }
        );
        }


    }

    deleteBook() {
        const result = confirm( 'Warning! \n\nAre you sure you want to delete this book reference: ' +
        this.book.title + ', and all of it\'s related data from the database?' +
        ' width ID: ' + this.book.id + '? ');
        if (result) {
            console.log('Got the ok to delete the book.');

        this.bookService.deleteBook( this.book.id ).subscribe(
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
