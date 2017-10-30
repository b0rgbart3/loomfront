import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../course.service';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Section } from '../../models/section.model';
import { FileUploader } from 'ng2-file-upload';
import { Material } from '../../models/material.model';
import { MaterialService } from '../../materials/material.service';
const COURSE_IMAGE_PATH = 'http://localhost:3100/courseimages';

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
    sectionReferences: FormGroup[];
    materialReferences: FormArray[];
    course: Course;
    id: number;
    errorMessage: string;
    image: string;
    imageUrl = '';
    public uploader: FileUploader;
    localImageUrl = '';
    tempName = '';
    thisFile: File;
    materials: Material[];
    matObjRefArray: Object[];
    existingImage: string;
    uploadedCourseImage: boolean;
    materialFormArrayReferences: FormArray[]; // these are just pointers to the various material form arrays

    constructor(private router: Router, private activated_route: ActivatedRoute,
        private courseService: CourseService, private fb: FormBuilder, private materialService: MaterialService ) { }

    ngOnInit(): void {

        // Get the id from the activated route -- and get the data from the resolvers
        this.id = this.activated_route.snapshot.params['id'];
        this.course = this.activated_route.snapshot.data['course'][0];
        this.materials = this.activated_route.snapshot.data['materials'];

        console.log(JSON.stringify(this.materials));
        this.existingImage = COURSE_IMAGE_PATH + '/' + this.id + '/' + this.course.image;

        this.uploadedCourseImage = false;
        this.sectionsFormArray = this.fb.array([  ]);
        this.courseFormGroup = this.fb.group({
            title: [ '', [Validators.required, Validators.minLength(3)] ] ,
            description: [ '', [Validators.required ]],
            imageUploader: '',
            sections: this.sectionsFormArray
        });
        this.addCourseImage();
        this.buildSections();
    }

    buildSections() {
        this.sectionReferences = [];
         if (this.course.sections) {
            this.materialFormArray = [];
            for (let i = 0; i < this.course.sections.length; i++) {
                this.materialFormArray[i] = this.fb.array([]);
                if (this.course.sections[i].materials) {
                for (let j = 0; j < this.course.sections[i].materials.length; j++ ) {
                    this.materialFormArray[i].push(this.buildMaterialsSubSection(this.course.sections[i].materials[j]['material']));
                } }
                this.sectionReferences[i] = this.fb.group( {
                    title: this.course.sections[i].title,
                    content: this.course.sections[i].content,
                    materials: this.materialFormArray[i]
                 });
                this.sectionsFormArray.push(  this.sectionReferences[i] );

                }
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

    fileChange(event) {
        const fileList: FileList = event.target.files;
        if ( fileList.length > 0) {
            const file: File = fileList[0];
            this.thisFile = file;
        }
    }

    populateForm(): void {
        this.courseFormGroup.patchValue({'title': this.course.title, 'description': this.course.description });
    }

    getCourse(id: number) {
        this.courseService.getCourse(id).subscribe(
            course => {this.course = <Course>course[0];
                // console.log('got course info :' + JSON.stringify(course) );
                this.image = this.course.image;
                this.imageUrl = COURSE_IMAGE_PATH + '/' + this.course.id + '/' + this.image;
             },
            error => this.errorMessage = <any> error
        );
    }

    postCourse() {

        if (this.uploadedCourseImage) {
        this.course.image = this.image; }
         // This is Deborah Korata's way of merging our data model with the form model
        const combinedCourseObject = Object.assign( {}, this.course, this.courseFormGroup.value);
        // const combinedCourseObject = this.courseFormGroup.value;

        console.log( 'Posting course: ' + JSON.stringify(combinedCourseObject) );

        if (this.course.id === '0') {
            this.courseService.createCourse( combinedCourseObject ).subscribe(
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
            this.courseService
            .updateCourse( combinedCourseObject ).subscribe(
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

    addSection(): void {
      this.sectionsFormArray.push(this.buildSection());
    }

    addMaterial(i): void {
        this.materialFormArray[i].push(this.buildMaterialsSubSection(''));
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


    addCourseImage() {
        const urlWithQuery = 'http://localhost:3100/api/courseimages?id=' + this.id;
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
            this.imageUrl = COURSE_IMAGE_PATH + '/' +  this.course.id + '/' + this.image;
            this.uploader.queue[0].remove();
        };
    }
}
