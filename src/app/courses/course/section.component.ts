import { Component, OnInit, Output, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../models/course.model';
import { MaterialService } from '../../materials/material.service';
import { Material } from '../../models/material.model';
import { Section } from '../../models/section.model';
import { MaterialCollection } from '../../models/materialcollection.model';




@Component({
    moduleId: module.id,
    selector: 'section',
    templateUrl: 'section.component.html',
    styleUrls: ['section.component.css']
})

export class SectionComponent implements OnInit, OnChanges {
    private _course: Course;
    private _section: Section;
    materialCollection: MaterialCollection;
    title: string;
    content: string;


    @Input() course: Course;
    // set course(course: Course) {
    //     this._course = course;
    //     console.log('course Updated');
    //   }

    // get course(): Course { return this.course; }

    @Input() section: Section;
    // set section(section: Section) {
    //     this._section = section;
    //     this.title = this._section.title;
    //     this.content = this._section.content;
    //     console.log('section updated');
    // }

    // get section(): Section { return this.section; }


    public materials: Material [];
    public materialRefs: Object [];
   // public section: Section;
    // public title: string;
    // public content: string;
    // public description: string;

    constructor (private materialService: MaterialService ) {}


    ngOnInit() {

        // this.title = this.course.title;
        // this.description = this.course.description;
        // console.log('sectionNumber: ' + this.section);
        // this.section = this.course.sections[this.sectionNumber];
        // this.materialRefs = this.section.materials;
        this.loadInMaterials();
//        this.reLintContent();
    }

        // reLintContent() {
        // if (this.course.sections && this.course.sections.length > 0) {
        //  for (let lcSection = 0; lcSection < this.course.sections.length; lcSection++) {
        //       const sc = this.course.sections[lcSection].content;
        //       const editedSC = sc.replace(/<br>/g, '\n');
        //       console.log('Looking at: ' + sc );
        //       this.course.sections[lcSection].content = editedSC;
        //  } }

   // }

    ngOnChanges() {
        // console.log('changes');

        this.loadInMaterials();
     }

    loadInMaterials() {
            this.materials = [];
            if (this.section.materials) {
            for (let j = 0; j < this.section.materials.length; j++) {
                const id = this.section.materials[j]['material'];

                this.materialService.getMaterial(id).subscribe(
                    (material) => { // console.log('found a material ' + j);
                    this.materials.push(material[0]);
                    if (this.materials.length === this.section.materials.length) {
                        // if these are equal, that means we've loaded in all the material objects
                        // so now we can sort them.
                       const sortedMaterials = this.materialService.sortMaterials(this.materials);
                        this.materialCollection = sortedMaterials;
                    }

                }

                );
            }

        }
    }

}

