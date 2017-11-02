import { Component, OnInit, DoCheck, OnChanges } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseService } from '../../courses/course.service';
import { User } from '../../models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassModel } from '../../models/class.model';
import { ClassService } from '../class.service';
import { UserService } from '../../users/user.service';
import { ContentChart } from '../../models/contentchart.model';
import { Section } from '../../models/section.model';
import { MaterialService } from '../../materials/material.service';
import { Material } from '../../models/material.model';
import { Student } from '../../models/student.model';
import { Instructor } from '../../models/instructor.model';
import { Userthumbnail } from '../../models/userthumbnail.model';


const COURSE_IMAGE_PATH = 'http://localhost:3100/courseimages';
const AVATAR_IMAGE_PATH = 'http://localhost:3100/avatars/';

@Component({

  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css'],
  providers: [CourseService]
})

export class ClassComponent implements OnInit, DoCheck, OnChanges {
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
    section: 0;

    constructor( private router: Router,
    private activated_route: ActivatedRoute,
    private classService: ClassService,
    private courseService: CourseService,
    private userService: UserService,
    private materialService: MaterialService ) {}
    public instructorThumbnails: Userthumbnail[];
    public studentThumbnails: Userthumbnail[];

    ngOnInit() {

        this.myInit();

    }

    myInit() {
        this.classID = this.activated_route.snapshot.params['id'];
        this.thisClass = this.activated_route.snapshot.data['thisClass'][0];
        this.users = this.activated_route.snapshot.data['users'];
        this.instructors = [];
        this.instructors = this.classService.getInstructors(this.thisClass, this.users);
        this.students = [];
        this.students = this.classService.getStudents(this.thisClass, this.users);

        this.instructorThumbnails = this.instructors.map(this.createThumbnail);
        this.studentThumbnails = this.students.map(this.createThumbnail);

        this.courseID = this.thisClass.course;
        // this.jumpTo = this.activated_route.snapshot.params['section'];
        // console.log('activated route section# ' + this.jumpTo);

        this.courseService.getCourse(this.courseID).subscribe(
            course =>  {this.course = course[0];
            this.courseimageURL = 'http://localhost:3100/courseimages/' + this.courseID + '/' + this.course.image;

            this.loadInMaterials();
        
            },
                error => this.errorMessage = <any>error);
    }
    createThumbnail(user) {
        const thumbnailObj = { user: user, user_id: user.id, editable: false, inRoom: true,
            size: 100,  showUsername: true, showInfo: false };
        return thumbnailObj;
    }

    populateForm() {

    }
    ngOnChanges() {
        this.myInit();
    }

    ngDoCheck() {
        if (this.activated_route.snapshot.params['section']) {
        this.section = this.activated_route.snapshot.params['section']; }
        console.log('activated route section# ' + this.section);
        if (this.section === undefined) {
            this.section = 0;
        }
    }

    navigateTo(sectionNumber) {
        console.log('will navigate to: ' + sectionNumber);
        this.router.navigate(['classes/' + this.classID + '/' + sectionNumber]);
    }


    // This method takes a section object, and creates a contentChart - which includes
    // all the content from the section, as well as all the material info - so that it's
    // neatly in one data object.  This requires loading in all the material info from
    // references that are stored in the section arrays in the db for the course.

    loadInMaterials() {
        for (let i = 0; i < this.course.sections.length; i++) {
            const matArray = this.course.sections[i].materials;

            this.materials[i] = [];
            if (matArray) {
            for (let j = 0; j < matArray.length; j++) {
                const id = matArray[j]['material'];

                this.materialService.getMaterial(id).subscribe(
                    (material) => { // console.log('found a material ' + j);
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





}


