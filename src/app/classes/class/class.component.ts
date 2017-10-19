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


const COURSE_IMAGE_PATH = 'http://localhost:3100/courseimages';
const AVATAR_IMAGE_PATH = 'http://localhost:3100/avatars/';

@Component({

  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css'],
  providers: [CourseService]
})

export class ClassComponent implements OnInit {
    materialService: MaterialService;
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
    courseChart: ContentChart[];

    constructor( private activated_route: ActivatedRoute,
    private classService: ClassService,
    private courseService: CourseService,
    private userService: UserService ) {}

    ngOnInit() {
        const id = this.activated_route.snapshot.params['id'];
        this.classID = id;
        this.classService.getClass(id).subscribe( (classObject) => {
            this.thisClass = classObject[0]; this.continueInit(); },
         (err) => this.errorMessage = <any> err );

    }

    continueInit() {

        this.courseID = this.thisClass.course;
        this.courseService.getCourse(this.courseID).subscribe(
            course =>  {this.course = course[0];
            this.courseimageURL = 'http://localhost:3100/courseimages/' + this.courseID + '/' + this.course.image;
                console.log ( JSON.stringify (this.course ));

                this.populateForm();
                this.userService.getInstructors( this.thisClass.id ).subscribe(
                    (instructors) => {this.instructors = instructors;
                    this.instructorCount = instructors.length;
                    // console.log('Found Instructors: ' + JSON.stringify(this.instructors));
                    this.userService.getStudents( this.thisClass.id).subscribe(
                        (students) => { this.students = students;
                        this.studentCount = students.length;
                    // console.log('Found Students: ' + JSON.stringify(this.students));
                },
                    (err) => this.errorMessage = <any> err );
                },
                    (err) => this.errorMessage = <any> err
                );
        },
            error => this.errorMessage = <any>error);
    }

        populateForm() {

       // console.log('In pop form: regs: userChart: ' + JSON.stringify( this.userChart) );

     // this.createContentCharts();

    }


    // This method takes a section object, and creates a contentChart - which includes
    // all the content from the section, as well as all the material info - so that it's
    // neatly in one data object.  This requires loading in all the material info from
    // references that are stored in the section arrays in the db for the course.

    createContentCharts() {
    this.courseChart = <ContentChart[]> [];

    // Need to loop through all the sections in this course.

    for (let j = 0; j < this.course.sections.length; j++ ) {
        const contentChart = <ContentChart> {};
        const section = <Section> this.course.sections[j];

        contentChart.title = section.title;
        contentChart.id = section.id;
        contentChart.content = section.content;
        contentChart.course_id = this.course.id;
        contentChart.materials = [];

        // curious to see if this subscription can add content to our array,
        // even if it comes in asychronously...?

        for (let i = 0; i < section.materials.length; i++ ) {
        const materialID = section.materials[i]['reference'];
            this.materialService.getMaterial(materialID).subscribe(
                (material) => { contentChart.materials.push(material);
                // console.log('received material: ' + JSON.stringify(material) );

                if (i + 1 === section.materials.length) {
                    console.log('WE FINISHED THE LOOP');
                    console.log('COURSE CHART: ' + JSON.stringify(this.courseChart));
                }
             },
                error => this.errorMessage = <any>error);

        this.courseChart.push(contentChart);

        }
    }

    console.log('COURSE CHART: ' + JSON.stringify(this.courseChart));
  }


}

