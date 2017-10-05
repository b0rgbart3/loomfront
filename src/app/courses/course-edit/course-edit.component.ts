import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../course.service';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Section } from '../../models/section.model';
import { FileUploader } from 'ng2-file-upload';
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
    image: string;
    imageUrl: string;
    formSections: FormArray;
    public uploader: FileUploader;
    localImageUrl: string;
    tempName: string;
    thisFile: File;
    // sections: Object[];

    get sections(): FormArray {
        return <FormArray>this.courseForm.get('sections');
    }

    constructor(private router: Router, private activated_route: ActivatedRoute,
        private courseService: CourseService, private fb: FormBuilder ) { }

    ngOnInit(): void {
        // Instantiating the Root Form Group Object
        // This service takes in a form configuration object

            // this.buildSection()
   
        this.formSections = this.fb.array([  ]);
        this.courseForm = this.fb.group({
            title: [ '', [Validators.required, Validators.minLength(3)] ] ,
            description: [ '', [Validators.required ]],
            imageUploader: '',
            sections: this.formSections,

        });


        this.id = +this.activated_route.snapshot.params['id'];
        // console.log('MyID: ' + id);

        if (this.id !== 0) {
            this.getCourse(this.id);
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
             // console.log("Uploaded: " + JSON.stringify( fileItem._file ) );

            // this.courseForm.patchValue({'image': fileItem._file});
          };
          this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {

             this.tempName = this.uploader.queue[0].file.name;
            console.log('Response from the server: ' + this.tempName);

             // const newfilename = 'courseimage.' + this.tempName.split('.')[this.tempName.split('.').length - 1];
            // console.log('New name: ' + newfilename);
             this.image = this.tempName;
             this.imageUrl = COURSE_IMAGE_PATH + this.course.id + '/' + this.image;

             console.log("Image url: " + this.imageUrl);

            // this.courseForm.patchValue({'image': this.image });
             this.uploader.queue[0].remove();
         };

        //  this.favoritecolor.valueChanges.subscribe( value => console.log(value) );
        //  this.avatarInput.valueChanges.subscribe( value => console.log('value change: ' + value) );

    }


    fileChange(event) {
        const fileList: FileList = event.target.files;
        if ( fileList.length > 0) {
            const file: File = fileList[0];
            console.log('Got a file: ' + file.name);
            this.thisFile = file;

        }
    }


    populateForm(): void {
        this.courseForm.patchValue({'title': this.course.title, 'description': this.course.description });

        if (this.course.sections) {
            for (let i = 0; i < this.course.sections.length; i++) {
                // this.addSection();
                this.sections.push(this.fb.group( this.course.sections[i]) );
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
        console.log(this.course.image);
        console.log(JSON.stringify( this.course ) );
        let combinedCourseObject = Object.assign( {}, this.course, this.courseForm.value);
        console.log( 'Course Form Info: ' + JSON.stringify(this.courseForm.value) );
        console.log( 'combined: ' + JSON.stringify(combinedCourseObject));
    }
    postCourse() {
        this.course.image = this.image;
         // This is Deborah Korata's way of merging our data model with the form model
        let combinedCourseObject = Object.assign( {}, this.course, this.courseForm.value);
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

    buildSection(): FormGroup {
        return this.fb.group( {
            sectionTitle: '',
            sectionContent: ''
        });
    }

    addBookRef() {

    }

    
    killSection(i) {
        // console.log('Kill' + i);
        let k = confirm('Are you sure you want to delete this whole section, and all the related reference materials?');
        if (k) {
        this.sections.removeAt(i); }
        // this.courseForm.get('sections').splice(i, 1);
        // Here I need to remove the section with an index of i from the sections array.
    }
}
