import { Component, OnInit, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../models/course.model';
import { MaterialService } from '../../materials/material.service';
import { Material } from '../../models/material.model';
import { Section } from '../../models/section.model';




@Component({
    moduleId: module.id,
    selector: 'course',
    templateUrl: 'course.component.html',
    styleUrls: ['course.component.css']
})

export class CourseComponent implements OnInit {
    @Input() course: Course;
    public materials: Material[][];
    public section: number;
    public currentSection: Section;

    constructor (private materialService: MaterialService ) {}

    ngOnInit() {
        this.section = 0;
        this.currentSection = this.course.sections[this.section];
    }

   previousSection() {
        this.section--;
        if (this.section < 0) {
            this.section = this.course.sections.length - 1;
        }
        this.currentSection = this.course.sections[this.section];
        console.log('nexting');
    }

    nextSection() {
        this.section++;
        if (this.section === this.course.sections.length) {
            this.section = 0;
        }
        this.currentSection = this.course.sections[this.section];
        console.log('nexting');
    }
}
