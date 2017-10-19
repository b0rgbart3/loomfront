import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseService } from '../../courses/course.service';
import { User } from '../../models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassModel } from '../../models/class.model';
import { ClassService } from '../class.service';
import { UserService } from '../../users/user.service';
import { Classregistrationgroup } from '../../models/classregistrationgroup.model';
import { Classregistration } from '../../models/classregistration.model';
import { ContentChart } from '../../models/contentchart.model';
import { Section } from '../../models/section.model';
import { MaterialService } from '../../materials/material.service';
import { Material } from '../../models/material.model';


const COURSE_IMAGE_PATH = 'http://localhost:3100/courseimages';
const AVATAR_IMAGE_PATH = 'http://localhost:3100/avatars/';

@Component({

  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css'],
  providers: [CourseService]
})

export class ClassComponent implements OnInit {
    classID: string;
    thisClass: ClassModel;
    errorMessage: string;
    courseID: string;
    classes: ClassModel[];
    course: Course;
    courseimageURL: string;
    users: User[];
    instructors: User[];
    students: User[];
    instructorCount= 0;
    studentCount= 0;
    materials = [];
    materialsLoaded: boolean;

    constructor( private activated_route: ActivatedRoute,
    private classService: ClassService,
    private courseService: CourseService,
    private userService: UserService,
    private materialService: MaterialService ) {}

    ngOnInit() {

        this.classID = this.activated_route.snapshot.params['id'];
        this.thisClass = this.activated_route.snapshot.data['thisClass'][0];
        this.courseID = this.thisClass.course;
        this.courseService.getCourse(this.courseID).subscribe(
            course =>  {this.course = course[0];
            this.courseimageURL = 'http://localhost:3100/courseimages/' + this.courseID + '/' + this.course.image;

            this.loadInMaterials();
            this.userService.getInstructors( this.thisClass.id ).subscribe(
                (instructors) => {this.instructors = instructors;
                this.instructorCount = instructors.length;
                this.userService.getStudents( this.thisClass.id).subscribe(
                    (students) => { this.students = students;
                    this.studentCount = students.length;
            },
                (err) => this.errorMessage = <any> err );
            },
                (err) => this.errorMessage = <any> err );
            },
                error => this.errorMessage = <any>error);

    }

    populateForm() {

    }


    // This method takes a section object, and creates a contentChart - which includes
    // all the content from the section, as well as all the material info - so that it's
    // neatly in one data object.  This requires loading in all the material info from
    // references that are stored in the section arrays in the db for the course.

    loadInMaterials() {
        for (let i = 0; i < this.course.sections.length; i++) {
            const matArray = this.course.sections[i].materials;

            this.materials[i] = [];
            for (let j = 0; j < matArray.length; j++) {
                const id = matArray[j]['material'];

                this.materialService.getMaterial(id).subscribe(
                    (material) => { console.log('found a material ' + j);
                    this.materials[i].push(material[0]);

                    // if ((i + 1 === this.course.sections.length) && (j + 1 === matArray.length)) {
                    //     this.materialsLoaded = true;
                    //     console.log('Done loading materials: ' + JSON.stringify( this.materials ) );
                    // }

                }

                );
            }

        }
    }





}


