import { Component, OnInit, SecurityContext } from '@angular/core';
import { Course } from '../../models/course.model';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Section } from '../../models/section.model';
import { FileUploader } from 'ng2-file-upload';
import { Material } from '../../models/material.model';
import { Book } from '../../models/book.model';
import { MaterialService } from '../../services/material.service';
import { Globals } from '../../globals2';
import { MaterialCollection } from '../../models/materialcollection.model';
import { Materialtype } from '../../models/materialtype.model';
import { DomSanitizer } from '@angular/platform-browser';
import _ from 'lodash';
import {Location} from '@angular/common';
import { DragulaService } from 'ng2-dragula';

@Component({
    moduleId: module.id,
    templateUrl: 'courseObject-edit.component.html',
    styleUrls: ['courseObject-edit.component.css']
})



export class CourseObjectEditComponent implements OnInit {

    course: Course;
    id: number;
    materials: Material[];
    courseFormGroup: FormGroup;
    sectionControls: FormArray;
    uploadedCourseImage: boolean;
    image: string;
    imageURL: string;
    existingImage: string;
    errorMessage: string;
    items: any[];
    originalCourse: Course;
    originalMaterialArrays: string[][];
   // sectionPointers: FormGroup[];


    constructor( private router: Router, private activated_route: ActivatedRoute,
        private courseService: CourseService, private fb: FormBuilder,
        private materialService: MaterialService, private globals: Globals,
        private dragulaService: DragulaService,
    private _sanitizer: DomSanitizer,
    private _location: Location  ) {
        const bag: any = this.dragulaService.find('section-bag');
        if (bag !== undefined ) {this.dragulaService.destroy('section-bag'); }

        dragulaService.createGroup('section-bag', {
            moves: function (el, container, handle) {
             //   console.log(handle);
              return handle.className === 'mat-content';   // mat-content is the class of the "span" for the material expander's titlebar
            }
          });

          dragulaService.drop('section-bag').subscribe((value) => {
            console.log(`drop: ${value[0]}`);
            this.onDrop();
          });
    }

    onDrop() {
        // Here the user rearranged the sections - so we just need to update their individual sectionNumbers to reflect the new order
        // for (let i = 0; i < this.course.sections.length; i++ ) {
        //     this.course.sections[i].sectionNumber = i;
        // }
    }
    ngOnInit() {

        // this.router.events.subscribe((evt) => {
        //     if (!(evt instanceof NavigationEnd)) {
        //         return;
        //     }
        //     window.scrollTo(0, 0);
        // });

        this.items = [{'title': 'Mary'},
        {'title': 'joe'},
        {'title': 'little bob'},
    ];
        this.id = this.activated_route.snapshot.params['id'];

        this.course = this.activated_route.snapshot.data['course'];
        this.originalMaterialArrays = [];
        this.originalCourse = _.cloneDeep(this.course);  // Deep Clone the object - otherwise it's just another pointer
        // for (let i = 0; i < this.course.sections.length; i++) {
        //     this.originalMaterialArrays[i] = _.cloneDeep(this.course.sections[i].materials);
        //     // Object.assign({}, this.course.sections[i].materials);
        // }
        this.materials = this.activated_route.snapshot.data['materials'];

        this.uploadedCourseImage = false;
        if (this.id !== 0 && ( this.course.image !== '' )) {
            this.existingImage = this.globals.courseimages + '/' + this.id + '/' + this.course.image;
            //  console.log('Existing image: ' + this.existingImage);
          }

       // this.sectionControls = this.fb.array([  ]);
        this.courseFormGroup = this.fb.group( {
            title: [ ''] ,
            description: [ ''],
            imageUploader: '',
          //  sections: this.sectionControls
        });

        if (!this.course.sections) {
            this.course.sections = [];
        this.course.sections[0] = new Section('Welcome, Syllabus & Calendar', '', [], null, 0);
        }
        this.buildSectionForms();
        this.populateForm();
    }

    isDirty() {
        if (this.courseFormGroup.dirty) {
            console.log('courseFormGroup was dirty');
            return true;
        }
        // for (let i = 0; i < this.sectionControls.length; i++) {
        //     if (this.sectionControls.at(i).dirty) {
        //         return true;
        //     }
        // }
        if (this.course.sections.length !== this.originalCourse.sections.length) {
            console.log('Number of sections was different.');
            return true;
        }
        for (let i = 0; i < this.course.sections.length; i++) {
           // console.log(this.course.sections[i].title + ': ' + this.originalCourse.sections[i].title);
            if (!this.originalCourse.sections[i]) { return true; }  // If the section is new, then this 'Form' is dirty
            if (this.course.sections[i].title !== this.originalCourse.sections[i].title) {
                console.log('section titles were different');
                return true;    // If the titles are different (any of them ) then this 'Form' is dirty
            }
            if (this.course.sections[i].content) {
                if (this.lintString(this.course.sections[i].content) !== this.originalCourse.sections[i].content) {
                    console.log('section content was different.');
                    console.log('This course section content: ' + this.course.sections[i].content);
                    console.log('The orig course sec content: ' + this.originalCourse.sections[i].content);
                    return true;
                }
            }
            if (JSON.stringify(this.course.sections[i].materials) !== JSON.stringify(this.originalCourse.sections[i].materials)) {
                console.log('material list was different.');
                return true;
            }
        }
        return false;
    }

    checkDiff( section, index) {

    }
    addSectionForm() {
        // const sectionFormGroup = this.fb.group( {
        //     title: [''],
        //     content: [''],
        // });
        // this.sectionControls.push(sectionFormGroup);
//           this.sectionPointers.push(sectionFormGroup);
    }
    buildSectionForms() {
        // for (let i = 0; i < this.course.sections.length; i++) {
        //     this.addSectionForm();

        // }
    }
    addSection() {
        // this variable needs to exist before we start working with it
        if (this.course.sections) {

          // If there are no sections yet-- we need to create "Section Zero" before we add new sections
          // Section Zero is the section which allows us to display the syllabus (and still keep a clean URL path)
          if (this.course.sections.length < 1) {
              this.course.sections.push( new Section( 'Section0', '', [], null, this.course.sections.length) );
          }

        // OK - NOW we can add sections like normal
        this.course.sections.push( new Section( 'Section' + this.course.sections.length, '', [], null, this.course.sections.length) );
        }
    }
    destroySection(index: number) {
        console.log('Index passed: ' + index);
       this.course.sections.splice(index, 1);
    //   this.sectionControls.removeAt( index );
    }
    changeSection(section: Section) {
        // update the model in the course edit component to match the one passed by an event from
        // the section edit component
        console.log('Got notified of a change in one of the sections: ' + section.sectionNumber);
     //   this.course.sections[section.sectionNumber] = section;
     //   this.onDrop();
    }

    postCourse() {
        if (this.uploadedCourseImage) {
            this.course.image = this.image; }
             // This is Deborah Korata's way of merging our data model with the form model
           // const combinedCourseObject = Object.assign( {}, this.course, this.courseFormGroup.value);

            this.course.title = this.courseFormGroup.get('title').value;
            this.course.description = this.courseFormGroup.get('description').value;
            console.log('Will POST: ' + JSON.stringify(this.course));
            const lintedModel = this.lintMe( this.course );
            this.course = lintedModel;

           // console.log('# of section Controls: ' + this.sectionControls.length);
            // Clear out the old section data
            // this.course.sections = [];
        //    for (let i = 0; i < this.sectionControls.length; i++ ) {
            //    console.log('sectionControl: ' +  JSON.stringify( this.sectionControls.at(i).value ) );
                // console.log('SECTION CONTROL: ' + this.sectionControls[i].value);
                // this.course.sections[i].title = this.sectionControls[i].value.title;
                // this.course.sections[i].content = this.sectionControls[i].value.content;
          //  }
            // Let's just make sure the output sequence matches whatever state the user put it into
            for (let i = 0; i < this.course.sections.length; i++) {
                const section = this.course.sections[i];
                section.sectionNumber = i;
            }

            if (this.course.id === '0') {
                this.courseService.createCourse( this.course ).subscribe(
                    (val) => {
                      },
                      response => { this.reset();
                        this.router.navigate(['/admin/classes']);
                      },
                      () => {
                          this.reset();
                         this.router.navigate(['/admin/classes']);
                      }
                );
            } else {
                // Validate stuff here
                this.courseService
                .updateCourse( this.course ).subscribe(
                (val) => {

                },
                response => { this.reset(); this.router.navigate(['/admin/classes']);
                },
                () => {
                    this.reset();
                 this.router.navigate(['/admin/classes']);
                }
            );
            }
    }
    populateForm(): void {
        this.courseFormGroup.patchValue({'title': this.course.title,
        'description': this.course.description });
    }
    lintMe( combinedCourseObject ) {
        let lintedModel = combinedCourseObject;
     //   console.log('LINTING: ');
        for (let i = 0; i < combinedCourseObject.sections.length; i++) {
       //     console.log('Linting section: ' + i);
            const sectionContent = combinedCourseObject.sections[i].content;

            let LintedSectionContent = sectionContent;
            if (sectionContent) {
            LintedSectionContent = sectionContent.replace(/\n/g, '<br>'); }
            combinedCourseObject.sections[i].content = LintedSectionContent;
        //    console.log(combinedCourseObject.sections[i].content);
        }
        lintedModel = combinedCourseObject;
        return lintedModel;
    }

    lintString (string) {
        if (string) {
            return string.replace(/\n/g, '<br>');
        } else {return null; }
    }
    // call this method before posting the course
    lintSectionContent ( section ) {

        const sectionContent = section.content;

        let LintedSectionContent = sectionContent;
        if (sectionContent) {
          LintedSectionContent = sectionContent.replace(/\n/g, '<br>'); }
        section.content = LintedSectionContent;
        return section;
    }
    closer() {
        this.router.navigate(['/admin/classes']);
    }
    reset() {
        this.courseFormGroup.reset();

        // Since I didn't build angular Form Controls -- to match these data objects, I have to re-synch them
        // after a post so that the RouteGuard won't think the model is still dirty

        this.originalCourse = _.cloneDeep(this.course);  // Deep Clone the object - otherwise it's just another pointer
        // for (let i = 0; i < this.course.sections.length; i++) {
        //     this.originalMaterialArrays[i] = Object.assign({}, this.course.sections[i].materials);
        // }
        // for (let i = 0; i < this.course.sections.length; i++) {
        //     this.originalCourse.sections[i] = _.cloneDeep( this.course.sections[i]);
        //     this.originalCourse.sections[i].title = this.course.sections[i].title;

        //     this.originalCourse.sections[i].materials = _.cloneDeep(this.course.sections[i].materials);

        // }
    }

    removeCourse() {
        const result = confirm( 'Are you sure you want to remove this course,' +
    ' and ALL of it\'s related sections, with ID: ' + this.course.id + '? ');

    if (result) {
        this.courseService.removeCourse( this.course).subscribe( (val) => {
            this.router.navigate(['/admin/classes']);
        }, response => { this.router.navigate(['/admin/classes']); },
            () => { });
      }
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
