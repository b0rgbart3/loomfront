import { Component, OnInit, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
    @Input() section: number;
    public materials: Material[][];

    public currentSection: Section;

    constructor (private materialService: MaterialService,
    private activated_route: ActivatedRoute ) {}

    ngOnInit() {
        if (!this.section) { this.section  = 0; }
        // if (this.activated_route.snapshot.params['section']) {
        // this.section = this.activated_route.snapshot.params['section']; }

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
