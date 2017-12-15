import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../courses/course.service';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Section } from '../../models/section.model';
import { FileUploader } from 'ng2-file-upload';
import { Material } from '../../models/material.model';
import { Book } from '../../models/book.model';
import { MaterialService } from '../../materials/material.service';
import { Globals } from '../../globals';
import { BookService } from '../../services/book.service';

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
    books: Book[];
    matObjRefArray: Object[];
    existingImage: string;
    uploadedCourseImage: boolean;
    materialFormArrayReferences: FormArray[]; // these are just pointers to the various material form arrays
    materialPlaceholder: string;
    bookPlaceholder: string;
    sectionMaterials: Material[][]; // this is an array of the actual Material Objects that are being
                                    // referenced by the section(s) -- haven't implemented this yet.

    constructor(private router: Router, private activated_route: ActivatedRoute,
        private courseService: CourseService, private fb: FormBuilder,
        private materialService: MaterialService, private globals: Globals,
    private bookService: BookService ) { }

    ngOnInit(): void {
        this.materialPlaceholder = 'Choose a Material';
        this.bookPlaceholder = 'Choose a Book Reference';
        this.courseService.ngOnInit();

        // Get the id from the activated route -- and get the data from the resolvers
        this.id = this.activated_route.snapshot.params['id'];

        console.log('About to Edit Course ID: ' + this.id);

          this.course = this.activated_route.snapshot.data['course'];
          console.log('Course: ' + JSON.stringify(this.course));
          this.materials = this.activated_route.snapshot.data['materials'];

          this.books = this.activated_route.snapshot.data['books'];

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

        this.addCourseImage();
        this.deLintMe();
        this.buildSections();

    }

    buildSections() {
        console.log('building sections.');
        this.sectionReferences = [];

            this.materialFormArray = [];
            this.bookFormArray = [];

            for (let i = 0; i < this.course.sections.length; i++) {
                this.materialFormArray[i] = this.fb.array([]);
                this.bookFormArray[i] = this.fb.array([]);

                if (this.course.sections[i] && this.course.sections[i].materials) {
                for (let j = 0; j < this.course.sections[i].materials.length; j++ ) {
                    this.materialFormArray[i].push(this.buildMaterialsSubSection(this.course.sections[i].materials[j]['material']));
                } }
                if (this.course.sections[i] && this.course.sections[i].books) {
                    for (let j = 0; j < this.course.sections[i].books.length; j++ ) {
                        this.bookFormArray[i].push(this.buildBookSubSection(this.course.sections[i].books[j]['book']));
                    } }

                this.sectionReferences[i] = this.fb.group( {
                    title: this.course.sections[i].title,
                    content: this.course.sections[i].content,
                    materials: this.materialFormArray[i],
                    books: this.bookFormArray[i]
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

    buildBookSubSection(value) {
        return this.fb.group({
         book: value
     });
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
            console.log('delinting the sections');
            const sc = this.course.sections[i].content;
            const editedSC = sc.replace(/<br>/g, '\n');
            this.course.sections[i].content = editedSC;
        }
    }

    lintMe( combinedCourseObject ) {
        let lintedModel = combinedCourseObject;
        console.log('LINTING: ');
        for (let i = 0; i < combinedCourseObject.sections.length; i++) {
            console.log('Linting section: ' + i);
            const sectionContent = combinedCourseObject.sections[i].content;

            const LintedSectionContent = sectionContent.replace(/\n/g, '<br>');
            combinedCourseObject.sections[i].content = LintedSectionContent;
            console.log(combinedCourseObject.sections[i].content);
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

        console.log( 'Posting course: ' + JSON.stringify(combinedCourseObject) );

        const lintedModel = this.lintMe( combinedCourseObject );
        combinedCourseObject = lintedModel;

        if (this.course.id === '0') {
            this.courseService.createCourse( combinedCourseObject ).subscribe(
                (val) => {

                  },
                  response => {this.router.navigate(['/admin']);
                  },
                  () => {
                    this.router.navigate(['/admin']);
                  }
            );
        } else {
            // Validate stuff here
            this.courseService
            .updateCourse( combinedCourseObject ).subscribe(
            (val) => {

            },
            response => {this.router.navigate(['/admin']);
            },
            () => {
            this.router.navigate(['/admin']);
            }
        );
        }
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
        if (this.bookFormArray[i]) {
            this.bookFormArray[i].push(this.buildBookSubSection(''));
        } else {
            this.bookFormArray[i] = this.fb.array([]);
            this.bookFormArray[i].push(this.buildBookSubSection(''));
        }
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
