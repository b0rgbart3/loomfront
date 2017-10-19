import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../course.service';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Section } from '../../models/section.model';
import { FileUploader } from 'ng2-file-upload';
import { Material } from '../../models/material.model';
import { MaterialService } from '../../materials/material.service';

const COURSE_IMAGE_PATH = 'http://localhost:3100/courseimages';

@Component({
    moduleId: module.id,
    templateUrl: 'course-edit.component.html',
    styleUrls: ['course-edit.component.css']
})


export class CourseEditComponent implements OnInit {

    course: Course;
    courseFormGroup: FormGroup;
    id: string;

    constructor(private router: Router, private activated_route: ActivatedRoute,
        private courseService: CourseService, private fb: FormBuilder, private materialService: MaterialService ) { }

    ngOnInit(): void {
        this.id = this.activated_route.snapshot.params['id'];
        this.course = this.activated_route.snapshot.data['course'][0];

}


    postCourse() {

        const combinedCourseObject = Object.assign( {}, this.course, this.courseFormGroup.value);
        // const combinedCourseObject = this.courseFormGroup.value;

        console.log( 'Posting course: ' + JSON.stringify(combinedCourseObject) );

        if (this.course.id === '0') {
            this.courseService.createCourse( combinedCourseObject ).subscribe(
                (val) => {

                  },
                  response => {
                  },
                  () => {
                    this.router.navigate(['/admin']);
                  }
            );
        } else {
            // Validate stuff here
            this.courseService
            .updateCourse( combinedCourseObject ).subscribe(
            (val) => {

            },
            response => {
            },
            () => {
            this.router.navigate(['/admin']);
            }
        );
        }
    }


}
