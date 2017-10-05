import { Component, OnInit } from '@angular/core';
import { ClassModel } from '../models/class.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CourseService } from '../courses/course.service';
import { Course } from '../models/course.model';


@Component({
    moduleId: module.id,
    templateUrl: 'material-edit.component.html',
    styleUrls: ['material-edit.component.css']
})

export class MaterialEditComponent implements OnInit {
    materialForm: FormGroup;
    types: Array<string>;

    constructor(private fb: FormBuilder ) {    }

    ngOnInit() {

        this.types = ['Book Reference', 'PDF document', 'video', 'webpage', 'audio file' ];
        this.materialForm = this.fb.group({
            title: [ '', [Validators.required, Validators.minLength(3)] ] ,
            description: [ '', []],
            imageUploader: '',
            fileUploader: '',
    
        });
    }
}
