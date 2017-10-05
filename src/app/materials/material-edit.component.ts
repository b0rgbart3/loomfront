import { Component, OnInit } from '@angular/core';
import { ClassModel } from '../models/class.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CourseService } from '../courses/course.service';
import { Course } from '../models/course.model';
import { Material } from '../models/material.model';
import { MaterialService } from './material.service';


@Component({
    moduleId: module.id,
    templateUrl: 'material-edit.component.html',
    styleUrls: ['material-edit.component.css']
})

export class MaterialEditComponent implements OnInit {
    material: Material;
    materialForm: FormGroup;
    types: Array<string>;
    id: number;
    errorMessage: string;

    constructor(private fb: FormBuilder, private activated_route: ActivatedRoute, 
    private materialService: MaterialService ) {    }

    ngOnInit() {

        this.id = +this.activated_route.snapshot.params['id'];

        if (this.id !== 0) {
            this.getMaterial(this.id);
         }

        this.types = ['Book Reference', 'PDF document', 'video', 'webpage', 'audio file' ];
        this.materialForm = this.fb.group({
            title: [ '', [Validators.required, Validators.minLength(3)] ] ,
            description: [ '', []],
            contenturl: '',
            referenceurl: '',
            materialtype: ['', [ ] ],
            imageUploader: '',
            fileUploader: '',
        });
    }

    getMaterial(id: number) {
        this.materialService.getMaterial(id).subscribe(
            course => { this.material = <Material>course[0];
                // console.log('got course info :' + JSON.stringify(course) );
                // this.image = this.course.image;
                // this.imageUrl = COURSE_IMAGE_PATH + '/' + this.course.id + '/' + this.image;
                this.populateForm();
             },
            error => this.errorMessage = <any> error
        );
    }

    populateForm() {

    }

    postMaterial() {
        // this.material.image = this.image;
         // This is Deborah Korata's way of merging our data model with the form model
        const combinedObject = Object.assign( {}, this.material, this.materialForm.value);
        console.log( 'Posting course: ' + JSON.stringify( combinedObject ) );
    }
}
