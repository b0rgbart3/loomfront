import { Component, OnInit, Output, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../models/course.model';
import { MaterialService } from '../../materials/material.service';
import { Material } from '../../models/material.model';
import { Section } from '../../models/section.model';




@Component({
    moduleId: module.id,
    selector: 'section',
    templateUrl: 'section.component.html',
    styleUrls: ['section.component.css']
})

export class SectionComponent implements OnInit, OnChanges {
    // private _course: Course;
    // private _section: Section;


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
    // public title: string;
    // public content: string;
    // public description: string;

    constructor (private materialService: MaterialService ) {}


    ngOnInit() {

        // this.title = this.course.title;
        // this.description = this.course.description;
        this.materialRefs = this.section.materials;
        this.loadInMaterials();
    }

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

                }

                );
            }

        }
    }

}

