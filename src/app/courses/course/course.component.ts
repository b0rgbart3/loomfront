import { Component, OnInit, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../models/course.model';
import { MaterialService } from '../../materials/material.service';
import { Material } from '../../models/material.model';




@Component({
    moduleId: module.id,
    selector: 'course',
    templateUrl: 'course.component.html',
    styleUrls: ['course.component.css']
})

export class CourseComponent implements OnInit {
    @Input() course: Course;
    public materials: Material[][];

    constructor (private materialService: MaterialService ) {}

    ngOnInit() {
        this.loadInMaterials();
    }

    loadInMaterials() {
        if (this.course && this.course.sections) {
            this.materials = [];
        for (let i = 0; i < this.course.sections.length; i++) {
            const matArray = this.course.sections[i].materials;

            this.materials[i] = [];
            for (let j = 0; j < matArray.length; j++) {
                const id = matArray[j]['material'];

                this.materialService.getMaterial(id).subscribe(
                    (material) => { console.log('found a material ' + j);
                    this.materials[i].push(material[0]);

                }

                );
            }

        }
      }
    }
}
