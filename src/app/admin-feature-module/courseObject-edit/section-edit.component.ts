import { Component, OnInit, SecurityContext, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Course } from '../../models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
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
import { Subject } from 'rxjs/Subject';
import { ChoiceList } from '../../models/choiceList.model';
import { DragulaService } from 'ng2-dragula';

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
    @Output() onChange = new EventEmitter <Section>();

    sectionFormGroup: FormGroup;
    openModal: Subject<any> = new Subject();
    newMaterialModal: Subject<any> = new Subject();
    choiceList: string[];
    currentMaterialGroup: Material[];
    dragOptions: any;
    bagName: string;
    materialTypes: any[];

    constructor( private fb: FormBuilder, private globals: Globals, private materialService: MaterialService,
        private dragulaService: DragulaService) {

            // This gets drop events and passes them on to our private method
            // but I'm not actually grabbing the value - here - I'm just sending the whole
            // data model.  Dragula is changing our Data model for us- because we bound the bag
            // to our data model in the HTML template

                dragulaService.drop('section-bag').subscribe((value) => {
                   // console.log(`drop: ${value[0]}`);
                    this.onDrop(value);  //.slice(1)
                });

           }

    // this gets drop events and emits our data model to our parent component
    // We need to update our Parent component - because it will take our model data
    // and save it (as though it were form data)

    private onDrop(args) {
        console.log(JSON.stringify(this.section.materials));
        this.onChange.emit(this.section);
    }
    ngOnInit() {
        this.materialTypes = this.globals.materialTypes;
        this.bagName = 'materials-bag' + this.index;
      //  console.log('Bag name: ' + this.bagName);

        this.deLintMe();
        // This tells my Drag Bag to fire off this method whenever Drag happens
        this.dragOptions = { moves: this.dragEvent };
        this.sectionFormGroup = this.fb.group( {
            title: [ ''] ,
            content: [ ''],
        });

        this.sectionFormGroup.patchValue({'title': this.section.title,
        'content': this.section.content });

        this.sectionFormGroup.get('title').valueChanges.subscribe( value => {
            // grab the new title value and emit it to our parent course editor
            this.section.title = value;
            this.onChange.emit(this.section);
        //    console.log('section change: ' + value );
            }
        );

        // same for the content text area control
        this.sectionFormGroup.get('content').valueChanges.subscribe( value => {
            this.section.content = value;
            this.onChange.emit(this.section);
      //      console.log('section change: ' + value );
        });
    }


    delete() {
        const destroyApproved = confirm('Are you sure you want to completely remove this entire section?');
        if (destroyApproved) {
        this.onDestroy.emit( this.index ); }
    }

    addMaterial( index ) {
        const material = this.globals.materialTypes[index].type;
        let materialGroup = null;
        console.log(material);

        this.materialService.getDynamicMaterials(0, material).subscribe(
            materials => {
                 materialGroup = materials;
                this.currentMaterialGroup = materials;
                const materialList = materialGroup.map( mat => mat.title );
               // console.log('Built materialList: ' + JSON.stringify(materialGroup));
                const choiceList = new ChoiceList( 'Choose a ' + material, material, materialList);

                // I am using the openModal as an observable subject -- so that I can push a new list to it
                // as a way of telling the Modal to display itself - and initiate that process.  Pretty cool!

                this.openModal.next(choiceList); }
        );
    }

    // The user chose a material from the modal list - so let's add it to this section's list of material ids
    newMaterialAdded( material ) {
        // If a materialObject got sent back to us - that means it's a new one and we want to add it to the list
        // otherwise the user was just editing an existing material object
        if (material) {
        this.section.materials.push(material.id); }
    }

    // The user hit one of the square buttons to add a new material - so we create an empty material object
    // and push it to the material modal

    addNew( type ) {
        const emptyMaterial =  new Material( '', '', '0', type, '', '', '', '', '', '', '', false);
        this.newMaterialModal.next( emptyMaterial);
    }

    dragEvent(el, source, handle, sibling) {
       // console.log('dragg happened');
       // This is overkill.  I'm informing our parent component - evertime someone tries to drag one of
       // the materials around.  -- So that our data model in the parent can get updated.
       // Really this should only happen if this section's model has changed.
   //    if (this.onChange) { this.onChange.emit(this.section); }
        return true;  // if this doesn't return true, the drag won't happen.
    }

    chose( index ) {
     //   console.log('Chose: ' + JSON.stringify( this.currentMaterialGroup[index] ) );
        this.section.materials.push(this.currentMaterialGroup[index].id);
        // We finished adding a new material - so let's notify the parent of the change to our model data
        this.onChange.emit(this.section);
    }

    trashMaterial(index) {
        this.section.materials.splice( index, 1);
        // We finished trashing a material - so let's notify the parent of the change to our model data
        this.onChange.emit(this.section);
    }

    editMaterial(material) {
        console.log('About to edit: ' + material);
        const materialToEdit = this.materialService.getMaterialFromMemory(material);
        console.log('About to edit: ' + JSON.stringify(materialToEdit));
        this.newMaterialModal.next( materialToEdit );
    }

    deLintMe() {

            const sc = this.section.content;
            if (sc) {
            const editedSC = sc.replace(/<br>/g, '\n');
            this.section.content = editedSC; }

    }


}
