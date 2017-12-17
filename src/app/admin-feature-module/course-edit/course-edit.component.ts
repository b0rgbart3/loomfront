import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../courses/course.service';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Section } from '../../models/section.model';
import { FileUploader } from 'ng2-file-upload';
import { Material } from '../../models/material.model';
import { Book } from '../../models/book.model';
import { MaterialService } from '../../services/material.service';
import { Globals } from '../../globals';

@Component({
    moduleId: module.id,
    templateUrl: 'course-edit.component.html',
    styleUrls: ['course-edit.component.css']
})

export class CourseEditComponent implements OnInit {
    courseFormGroup: FormGroup;
    sectionsFormArray: FormArray;
    sectionFormGroup: FormGroup;
    materialFormArray: FormArray[];
    bookFormArray: FormArray[];
    docFormArray: FormArray[];
    sectionReferences: FormGroup[];
    materialReferences: FormArray[];
    course: Course;
    id: string;
    errorMessage: string;
    image: string;
    imageUrl = '';
    public uploader: FileUploader;
    localImageUrl = '';
    tempName = '';
    thisFile: File;
    materials: Material[];
    books: Material[];
    extractedBooks: Material[][];
    extractedDocs: Material[][];
    docs: Material[];
    bookOptions: Material[];
    docOptions: Material[];
    matObjRefArray: Object[];
    existingImage: string;
    uploadedCourseImage: boolean;
    materialFormArrayReferences: FormArray[]; // these are just pointers to the various material form arrays
    materialPlaceholder: string;
    bookPlaceholder: string;
    docPlaceholder: string;
    sectionMaterials: Material[][]; // this is an array of the actual Material Objects that are being
                                    // referenced by the section(s) -- haven't implemented this yet.

    constructor(private router: Router, private activated_route: ActivatedRoute,
        private courseService: CourseService, private fb: FormBuilder,
        private materialService: MaterialService, private globals: Globals ) { }

    ngOnInit(): void {
        this.materialPlaceholder = 'Choose a Material';
        this.bookPlaceholder = 'Choose a Book Reference';
        this.docPlaceholder = 'Choose a PDF Document';
        this.courseService.ngOnInit();
        this.extractedBooks = [];
        this.extractedDocs = [];
        this.bookFormArray = [];
        this.docFormArray = [];

        // Get the id from the activated route -- and get the data from the resolvers
        this.id = this.activated_route.snapshot.params['id'];

    //   console.log('About to Edit Course ID: ' + this.id);

          this.course = this.activated_route.snapshot.data['course'];
       //   console.log('Course: ' + JSON.stringify(this.course));
          this.materials = this.activated_route.snapshot.data['materials'];

          this.books = this.materials['books'];
          this.docs = this.materials['docs'];

          if (this.id !== '0' && ( this.course.image !== '' )) {
          this.existingImage = this.globals.courseimages + '/' + this.id + '/' + this.course.image;
            console.log('Existing image: ' + this.existingImage);
        }

        // console.log(JSON.stringify(this.materials));

        this.uploadedCourseImage = false;
        this.sectionsFormArray = this.fb.array([  ]);
        this.courseFormGroup = this.fb.group({
            title: [ '', [Validators.required, Validators.minLength(3)] ] ,
            description: [ '', [Validators.required ]],
            imageUploader: '',
            sections: this.sectionsFormArray
        });
      //  console.log('Built course form');

        this.getBooks();
       // console.log('gotBooks');
        this.getDocs();
       // console.log('gotDocs');

        this.addCourseImage();
        this.deLintMe();
        this.buildSections();

    }

    buildSections() {
       // console.log('building sections.');
        this.sectionReferences = [];

            this.materialFormArray = [];
            this.bookFormArray = [];
            this.docFormArray = [];

            for (let i = 0; i < this.course.sections.length; i++) {
                this.extractStuff(i);
                this.materialFormArray[i] = this.fb.array([]);
                this.bookFormArray[i] = this.fb.array([]);
                this.docFormArray[i] = this.fb.array([]);

                if (this.course.sections[i] && this.course.sections[i].materials) {
                for (let j = 0; j < this.course.sections[i].materials.length; j++ ) {
                    this.materialFormArray[i].push(this.buildMaterialsSubSection(this.course.sections[i].materials[j]['material']));
                } }
                if (this.course.sections[i] && this.extractedBooks[i] ) {
                    for (let j = 0; j < this.extractedBooks[i].length; j++ ) {
                        this.bookFormArray[i].push(this.buildMaterialsSubSection(this.extractedBooks[i][j]['id'] ));
                    } }

                if (this.course.sections[i] && this.extractedDocs[i] ) {
                    for (let j = 0; j < this.extractedDocs[i].length; j++ ) {
                        this.docFormArray[i].push(this.buildMaterialsSubSection(this.extractedDocs[i][j]['id']) );
                    } }

                this.sectionReferences[i] = this.fb.group( {
                    title: this.course.sections[i].title,
                    content: this.course.sections[i].content,
                    materials: this.materialFormArray[i],
                    books: this.bookFormArray[i],
                    docs: this.docFormArray[i]
                 });
                this.sectionsFormArray.push(  this.sectionReferences[i] );

                }

        this.populateForm();
    }

    get sections(): FormArray {
        return <FormArray>this.courseFormGroup.get('sections');
    }

    buildSection(): FormGroup {
        return this.fb.group( {
            title: '',
            content: ''
        });
   }

    buildMaterialsSubSection(value) {
       return this.fb.group({
        material: value
    });
    }

    // buildBookSubSection(value) {
    //     return this.fb.group({
    //      material: value
    //  });
    //  }

    extract( sectionNumber, type) {
        const extractedArray = [];
        if (this.course && this.course.sections &&
            this.course.sections[sectionNumber] &&
            this.course.sections[sectionNumber].materials) {

                for ( let j = 0; j < this.course.sections[sectionNumber].materials.length; j++) {

                    const matObj = this.course.sections[sectionNumber].materials[j];
                 //   console.log('mat: ' + JSON.stringify(matObj));

                    const foundObj = this.materials.find( materialObject => (materialObject.id === matObj['material'] ) );

                    if (foundObj) {
                    //    console.log( ' Found: ' + JSON.stringify(foundObj));
                        if (foundObj['type'] === type) {
                            extractedArray.push(foundObj);
                        }
                    }
                    // if (this.course.sections[sectionNumber].materials[j]['type'] === type) {
                    //     // found one
                    //     const foundObject = this.course.sections[sectionNumber].materials[j];
                    //     extractedArray.push(foundObject);
                    // }
                }
                // for (let j = 0; j < this.course.sections[sectionNumber].materials.length; j++) {
                //     const bookID = this.course.sections[sectionNumber].materials[j];
                //     const foundArray = this.materials.find( materialObject =>  (materialObject.type === type ) );
                //     extractedArray = foundArray;
                // }


        }
        return extractedArray;

    }
     // We want an array of books that has been selected for this SECTION --
     // so we look through all of the materials for this section, and extract the ones that are 'books'
     extractStuff(sectionNumber) {

        this.extractedBooks[sectionNumber] = [];
        this.extractedBooks[sectionNumber] = this.extract(sectionNumber, 'book');
        this.extractedDocs[sectionNumber] = [];
        this.extractedDocs[sectionNumber] = this.extract(sectionNumber, 'PDFdocument');
        console.log('extractedBook Count: ' + this.extractedBooks[sectionNumber].length);
        console.log('extracted books: ' + JSON.stringify(this.extractedBooks[sectionNumber]));
        console.log('extractedDoc Count: ' + this.extractedDocs[sectionNumber].length);
        console.log('extracted docs: ' + JSON.stringify( this.extractedDocs[sectionNumber] ) );
     }

    fileChange(event) {
        const fileList: FileList = event.target.files;
        if ( fileList.length > 0) {
            const file: File = fileList[0];
            this.thisFile = file;
        }
    }

    populateForm(): void {
        this.courseFormGroup.patchValue({'title': this.course.title,
        'description': this.course.description });
    }

    // getCourse(id: number) {
    //     this.courseService.getCourse(id).subscribe(
    //         course => {this.course = <Course>course[0];
    //             // console.log('got course info :' + JSON.stringify(course) );
    //             this.image = this.course.image;
    //             this.imageUrl = this.globals.courseimages + '/' + this.course.id + '/' + this.image;

    //         },
    //         error => this.errorMessage = <any> error
    //     );
    // }

    deLintMe() {
        for (let i = 0; i < this.course.sections.length; i++) {
       //     console.log('delinting the sections');
            const sc = this.course.sections[i].content;
            const editedSC = sc.replace(/<br>/g, '\n');
            this.course.sections[i].content = editedSC;
        }
    }

    lintMe( combinedCourseObject ) {
        let lintedModel = combinedCourseObject;
     //   console.log('LINTING: ');
        for (let i = 0; i < combinedCourseObject.sections.length; i++) {
       //     console.log('Linting section: ' + i);
            const sectionContent = combinedCourseObject.sections[i].content;

            const LintedSectionContent = sectionContent.replace(/\n/g, '<br>');
            combinedCourseObject.sections[i].content = LintedSectionContent;
        //    console.log(combinedCourseObject.sections[i].content);
        }
        lintedModel = combinedCourseObject;
        return lintedModel;
    }

    postCourse() {

        if (this.uploadedCourseImage) {
        this.course.image = this.image; }
         // This is Deborah Korata's way of merging our data model with the form model
        let combinedCourseObject = Object.assign( {}, this.course, this.courseFormGroup.value);
        // const combinedCourseObject = this.courseFormGroup.value;

        // I want to consolidate all the materials into one array for each section
        for (let j = 0; j < combinedCourseObject.sections.length; j++) {
            const bookGroup = combinedCourseObject.sections[j].books;
          //  console.log('Book Group' + j + ': ' + JSON.stringify(bookGroup) );
            combinedCourseObject.sections[j].materials = [];
            combinedCourseObject.sections[j].materials = combinedCourseObject.sections[j].materials.concat(bookGroup);
            delete combinedCourseObject.sections[j].books;
            const docGroup = combinedCourseObject.sections[j].docs;
            combinedCourseObject.sections[j].materials = combinedCourseObject.sections[j].materials.concat(docGroup);
            delete combinedCourseObject.sections[j].docs;
        //    console.log('Section' + j + ': ' + JSON.stringify(combinedCourseObject.sections[j]) );
        }


        // console.log( 'Posting course: ' + JSON.stringify(combinedCourseObject) );

        const lintedModel = this.lintMe( combinedCourseObject );
        combinedCourseObject = lintedModel;

        if (this.course.id === '0') {
            this.courseService.createCourse( combinedCourseObject ).subscribe(
                (val) => {

                  },
                  response => { this.router.navigate(['/coursebuilder']);
                  },
                  () => {
                     this.router.navigate(['/coursebuilder']);
                  }
            );
        } else {
            // Validate stuff here
            this.courseService
            .updateCourse( combinedCourseObject ).subscribe(
            (val) => {

            },
            response => { this.router.navigate(['/coursebuilder']);
            },
            () => {
             this.router.navigate(['/coursebuilder']);
            }
        );
        }
    }

    getBooks() {

        this.materialService.getDynamicMaterials(0, 'book').subscribe(
          books => this.bookOptions = books,
          error => this.errorMessage = <any> error);
      }

      getDocs() {

        this.materialService.getDynamicMaterials(0, 'PDFdocument').subscribe(
          docs => { this.docOptions = docs;
           // console.log('Got docs: ' + JSON.stringify(docs));
        },
          error => this.errorMessage = <any> error);
      }

    addSection(): void {
      this.sectionsFormArray.push(this.buildSection());
    }

    addMaterial(i): void {
        if (this.materialFormArray[i]) {
            this.materialFormArray[i].push(this.buildMaterialsSubSection(''));
        } else {
            this.materialFormArray[i] = this.fb.array([]);
        }
    }
    addBook(i): void {
       // console.log('Adding Book to section: ' + i);

        if (this.bookFormArray[i]) {
            console.log('FormArray for section #' + i + ' exists.');
            this.bookFormArray[i].push(this.buildMaterialsSubSection(''));
        } else {
            console.log('Creating FormArray for section #' + i);
            this.bookFormArray[i] = this.fb.array([]);
            this.bookFormArray[i].push(this.buildMaterialsSubSection(''));
        }
      //  console.log('Done building bookFormArray');
    }
    addDoc(i): void {
     //   console.log('Adding PDF Document to section: ' + i);

        if (this.docFormArray[i]) {
            console.log('FormArray for section #' + i + ' exists.');
            this.docFormArray[i].push(this.buildMaterialsSubSection(''));
        } else {
            console.log('Creating FormArray for section #' + i);
            this.docFormArray[i] = this.fb.array([]);
            this.docFormArray[i].push(this.buildMaterialsSubSection(''));
        }
      //  console.log('Done building bookFormArray');
    }

    killSection(i) {
        const k = confirm('Are you sure you want to delete this whole section, and all the related reference materials?');
        if (k) {
        this.sections.removeAt(i); }
    }

    killMaterial(i, j) {
          //  console.log (' section #' + i + ', material#' + j);
           this.materialFormArray[i].removeAt(j);
    }

    killBook(i, k) {
        this.bookFormArray[i].removeAt(k);
    }

    killDoc(i, k) {
        this.docFormArray[i].removeAt(k);
    }


    addCourseImage() {

            console.log('adding course image');
        const urlWithQuery = this.globals.postcourseimages + '?id=' + this.id;
        this.uploader = new FileUploader({url: urlWithQuery});
        this.uploader.onAfterAddingFile = (fileItem) => {
            const url = (window.URL) ? window.URL.createObjectURL(fileItem._file)
                : (window as any).webkitURL.createObjectURL(fileItem._file);
            this.localImageUrl = url;
            this.uploader.queue[0].upload();
            this.uploadedCourseImage = true;
         };
         this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            this.tempName = this.uploader.queue[0].file.name;
            this.image = this.tempName;
            this.imageUrl = this.globals.courseimages + '/' +  this.course.id + '/' + this.image;
            this.uploader.queue[0].remove();
        };
    }

    returnToCourseBuilder() {
        this.router.navigate(['/coursebuilder']);
    }
    deleteCourse(courseId) {
        const result = confirm( 'Are you sure you want to delete this course,' +
        ' and All of it\'s related sections, width ID: ' + courseId + '? ');
        if (result) {
            console.log('Got the ok to delete the course.');

        this.courseService.deleteCourse(courseId).subscribe(
            (data) => {
                console.log('Got back from the Course Service.');
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

}
