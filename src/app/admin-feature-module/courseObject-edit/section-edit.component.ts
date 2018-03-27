import { Component, OnInit, SecurityContext, Input, Output, EventEmitter } from '@angular/core';
import { Course } from '../../models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Section } from '../../models/section.model';
import { FileUploader } from 'ng2-file-upload';
import { Material } from '../../models/material.model';
import { Book } from '../../models/book.model';
import { MaterialService } from '../../services/material.service';
import { Globals } from '../../globals';
import { MaterialCollection } from '../../models/materialcollection.model';
import { Materialtype } from '../../models/materialtype.model';
import { DomSanitizer } from '@angular/platform-browser';
import _ from 'lodash';
import {Location} from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { ChoiceList } from '../../models/choiceList.model';


@Component({
    moduleId: module.id,
    selector: 'section-edit',
    templateUrl: 'section-edit.component.html',
    styleUrls: ['section-edit.component.css']
})



export class SectionEditComponent implements OnInit {


    @Input() section: Section;
    @Input() index: number;
    @Output() onDestroy = new EventEmitter <number>();

    sectionFormGroup: FormGroup;
    openModal: Subject<any> = new Subject();
    choiceList: string[];
    currentMaterialGroup: Material[];

    constructor( private fb: FormBuilder, private globals: Globals, private materialService: MaterialService ) {}

    ngOnInit() {
        this.deLintMe();
        this.sectionFormGroup = this.fb.group( {
            title: [ ''] ,
            content: [ ''],
            imageUploader: '',
        });

        this.sectionFormGroup.patchValue({'title': this.section.title,
        'content': this.section.content });
    }

    delete() {
        const destroyApproved = confirm('Are you sure you want to completely remove this entire section?');
        if (destroyApproved) {
        this.onDestroy.emit( this.index ); }
    }

    addMaterial( index ) {
        const material = this.globals.materialTypes[index];
        let materialGroup = null;
        console.log(material);

        this.materialService.getDynamicMaterials(0, material.type).subscribe(
            materials => { materialGroup = materials;
                this.currentMaterialGroup = materials;
                const materialList = materialGroup.map( mat => mat.title );
                console.log('Built materialList: ' + JSON.stringify(materialGroup));
                const choiceList = new ChoiceList( 'Choose a ' + material.type, materialList);
                this.openModal.next(choiceList); }
        );


    }
    chose( index ) {
        console.log('Chose: ' + JSON.stringify( this.currentMaterialGroup[index] ) );
        this.section.materials.push(this.currentMaterialGroup[index].id);
    }

    trashMaterial(index) {
        this.section.materials.splice( index, 1);
    }

    deLintMe() {

            const sc = this.section.content;
            if (sc) {
            const editedSC = sc.replace(/<br>/g, '\n');
            this.section.content = editedSC; }

    }


}
