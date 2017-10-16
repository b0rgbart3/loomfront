import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../course.service';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Section } from '../../models/section.model';
import { FileUploader } from 'ng2-file-upload';
import { Material } from '../../models/material.model';
import { MaterialService } from '../../materials/material.service';
import { Materialreference } from '../../models/materialreference.model';
const COURSE_IMAGE_PATH = 'http://localhost:3100/courseimages/';

@Component({
    moduleId: module.id,
    templateUrl: 'course-edit.component.html',
    styleUrls: ['course-edit.component.css']
})


export class CourseEditComponent implements OnInit {


    // This is the Form Model -- and the Root Form Group Object
    courseForm: FormGroup;

    // This is the Data Model
    course: Course = new Course( '', '', '0', [], '' );
    id: number;
    errorMessage: string;
    image = '';
    imageUrl = '';
    formSections: FormArray;
    public uploader: FileUploader;
    localImageUrl = '';
    tempName = '';
    thisFile: File;
    materialList: Material [];
//    materialReferences: FormArray;
    matObjRefArray: Object[]; // This is my custom object array so I can refer to material id#s instead of just the array indexes
    sectionReferences: FormArray[];
    // sections: Object[];

    get sections(): FormArray {
        return <FormArray>this.courseForm.get('sections');
    }

    constructor(private router: Router, private activated_route: ActivatedRoute,
        private courseService: CourseService, private fb: FormBuilder, private materialService: MaterialService ) { }

    ngOnInit(): void {
        // Instantiating the Root Form Group Object
        // This service takes in a form configuration object

        

        this.formSections = this.fb.array([  ]);
        this.sectionReferences = [];
        this.courseForm = this.fb.group({
            title: [ '', [Validators.required, Validators.minLength(3)] ] ,
            description: [ '', [Validators.required ]],
            imageUploader: '',
            sections: this.formSections,
        });

        // this.materialService.getMaterials().subscribe(
        //     materialList => {this.materialList = <Material []>materialList;
        //         // console.log('got course info :' + JSON.stringify(course) );
        //         this.buildMaterialObjectReferenceArray();
        //      },
        //     error => this.errorMessage = <any> error
        // );

        this.id = +this.activated_route.snapshot.params['id'];
        // console.log('MyID: ' + id);

        if (this.id !== 0) {
            this.getCourse(this.id);

         // before we even deal with the uploader - we should grab the existing image from the DB if there is one.

        // this.courseService.loadCourseImage( this.id ).subscribe(
        //     courseimage => { console.log(' got courseimage back from the server. ');
        //     const thecourseimage = courseimage[0];
        //     if (thecourseimage) {
        //     this.image = courseimage[0];
        //     const thecourseimageURL = 'http://localhost:3100/courseimages/' + this.id + '/' + thecourseimage.filename;
        //     this.imageUrl = thecourseimageURL;
        //     console.log('this courseimage image: ' + thecourseimageURL); } else { this.image = null; this.imageUrl = null; } },
        //     error => this.errorMessage = <any> error );
         }

         const urlWithQuery = 'http://localhost:3100/api/courseimages?id=' + this.id;
         this.uploader = new FileUploader({url: urlWithQuery});
         this.uploader.onAfterAddingFile = (fileItem) => {
             const url = (window.URL) ? window.URL.createObjectURL(fileItem._file)
                 : (window as any).webkitURL.createObjectURL(fileItem._file);
             this.localImageUrl = url;
             // this.avatarimage = 'http://localhost:3100/public/avatars/' + this.currentUserId + '/' + ;
             // this.avatarimage = url;
             this.uploader.queue[0].upload();

          };
          this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {

             this.tempName = this.uploader.queue[0].file.name;
            // console.log('Response from the server: ' + this.tempName);

             this.image = this.tempName;
             this.imageUrl = COURSE_IMAGE_PATH + this.course.id + '/' + this.image;

             this.uploader.queue[0].remove();
         };


    }

    // I am building this list of id#s and titles in their own array so I can easily reference them for the
    // select fields

    buildMaterialObjectReferenceArray() {
        // const matCount = this.materialList.length;

        // for (let i = 0; i < matCount; i++) {
        //     this.matObjRefArray.push({ 'id': this.materialList[i].id , 'title': this.materialList[i].title });
        // }
    }

    fileChange(event) {
        const fileList: FileList = event.target.files;
        if ( fileList.length > 0) {
            const file: File = fileList[0];
            // console.log('Got a file: ' + file.name);
            this.thisFile = file;

        }
    }



    populateForm(): void {
        this.courseForm.patchValue({'title': this.course.title, 'description': this.course.description });

        if (this.course.sections) {
            for (let i = 0; i < this.course.sections.length; i++) {

                 const sections = this.course.sections;
                 const section = <Section> sections[i];
                 const title = section.title;
                 const content = section.content;
                 const thissectionMaterials = section.materials;
                 // console.log ( JSON.stringify ( thissectionMaterials ));
                 if (thissectionMaterials) {
            //    console.log ( 'No of section materials: ' + thissectionMaterials.length );
             }
                const sectionMaterialReferences = <FormArray> this.fb.array([  ]);
                this.sectionReferences[i] = sectionMaterialReferences;

                for (let j = 0; j < thissectionMaterials.length; j++) {
                    // console.log('Found reference');
                    const materialReference = <Materialreference> thissectionMaterials[j];
                    // console.log( JSON.stringify( materialReference ) );
                    // console.log( typeof(materialReference) );
                    // console.log( materialReference.reference );
                    const refID = materialReference.reference;

                    // I need to grab the material object -- whos ID is
                    // stored in this material reference, so that the user will be choosing
                    // a 'value' for the select control that contains the ID of the material object,
                    // rather than the array index of the material object in the list.
                    // And yet this select control will still present the user with material titles
                    // instead of just ID #s.

                    // const materialObject = this.getMaterialObject(refID);


                    sectionMaterialReferences.push ( this.fb.group( {
                        reference: refID,
                    }));

                }

                // console.log(sectionMaterialReferences);


                this.sections.push(  this.fb.group( {
                    title: title,
                    content: content,
                    materials: sectionMaterialReferences
                }) );


                // console.log( this.sections );

                // this.sections[i].patchValue({'title': title, 'content': content });
           //     this.sections.push(this.fb.group( this.course.sections[i]) );
            }
        }
    }

    getCourse(id: number) {
        this.courseService.getCourse(id).subscribe(
            course => {this.course = <Course>course[0];
                // console.log('got course info :' + JSON.stringify(course) );
                this.image = this.course.image;
                this.imageUrl = COURSE_IMAGE_PATH + '/' + this.course.id + '/' + this.image;
                this.populateForm();
             },
            error => this.errorMessage = <any> error
        );
    }

    showForm() {
        this.course.image = this.image;
        // console.log(this.course.image);
        // console.log(JSON.stringify( this.course ) );
        const combinedCourseObject = Object.assign( {}, this.course, this.courseForm.value);
        // console.log( 'Course Form Info: ' + JSON.stringify(this.courseForm.value) );
        // console.log( 'combined: ' + JSON.stringify(combinedCourseObject));
    }
    postCourse() {
        this.course.image = this.image;
         // This is Deborah Korata's way of merging our data model with the form model
        const combinedCourseObject = Object.assign( {}, this.course, this.courseForm.value);
        console.log( 'Posting course: ' + JSON.stringify(combinedCourseObject) );

        if (this.course.id === '0') {
            this.courseService.createCourse( combinedCourseObject ).subscribe(
                (val) => {
                    // console.log('POST call successful value returned in body ', val);
                  },
                  response => {
                    // console.log('POST call in error', response);
                  },
                  () => {
                    // console.log('The POST observable is now completed.');
                  //   this.alertService.success('Thank you for registering with the Reclaiming Loom. ' +
                  //   ' Now, please check your email, and use the verification code to verify your account.  Thank you.', true);
                  //   // this._flashMessagesService.show('Username or password was incorrect.',
                    // { cssClass: 'alert-warning', timeout: 7000 });
                    this.router.navigate(['/admin']);
                  }
            );
        } else {
            // Validate stuff here
            this.courseService
            .updateCourse( combinedCourseObject ).subscribe(
            (val) => {
            // console.log('POST call successful value returned in body ', val);
            },
            response => {
            // console.log('POST call in error', response);
            },
            () => {
            // console.log('The POST observable is now completed.');
            //   this.alertService.success('Thank you for registering with the Reclaiming Loom. ' +
            //   ' Now, please check your email, and use the verification code to verify your account.  Thank you.', true);
            //   // this._flashMessagesService.show('Username or password was incorrect.',
            // { cssClass: 'alert-warning', timeout: 7000 });
            this.router.navigate(['/admin']);
            }
        );
        }
    }

    addSection(): void {
      //  this.sections.push( new Section( 'Section Title', '0', 'Section Content goes here...'));
      this.sections.push(this.buildSection());
    }


    buildMaterialReference(): FormGroup {
        return this.fb.group( {
            reference: ''
        });
    }


    buildSection(): FormGroup {
        const sectionMaterialReferences = <FormArray> this.fb.array([  ]);
        this.sectionReferences.push(sectionMaterialReferences);

        return this.fb.group( {
            title: '',
            content: '',
            materials: sectionMaterialReferences
        });
    }

    addMaterial(i): void {
        this.sectionReferences[i].push(this.buildMaterialReference());

//        this.courseForm.sections[i].materials.push(this.buildMaterialReference());
       //  this.populateForm();
        // const thisSection = <Section> this.course.sections[i];
        // thisSection.materials.push( { 'reference' : ''});


        // console.log(JSON.stringify(this.course.sections[i]) );
//        this.sections[i].materials.push(this.buildMaterialReference());
    }

    killSection(i) {
        // console.log('Kill' + i);
        const k = confirm('Are you sure you want to delete this whole section, and all the related reference materials?');
        if (k) {
        this.sections.removeAt(i); }
        // this.courseForm.get('sections').splice(i, 1);
        // Here I need to remove the section with an index of i from the sections array.
    }

    killMaterial(i, j) {
        // const k = confirm('Are you sure you want to delete this whole section, and all the related reference materials?');
        // if (k) {
            // console.log( 'Section References: ' + JSON.stringify( this.sectionReferences) );

            console.log (' section #' + i + ', material#' + j);
            this.sectionReferences[i].removeAt(j);
       // }
    }
}
