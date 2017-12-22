import { Component, OnInit, DoCheck, OnChanges } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseService } from '../../courses/course.service';
import { User } from '../../models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassModel } from '../../models/class.model';
import { ClassService } from '../class.service';
import { UserService } from '../../services/user.service';
import { ContentChart } from '../../models/contentchart.model';
import { Section } from '../../models/section.model';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../models/material.model';
import { Student } from '../../models/student.model';
import { Instructor } from '../../models/instructor.model';
import { Userthumbnail } from '../../models/userthumbnail.model';
import { BoardSettings } from '../../models/boardsettings.model';
import { Globals } from '../../globals';


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
    sectionNumber: number;
    section: Section;
    discussing: boolean;
    widthStyle: string;
    boardStyle: string;
    mainStyle: string;
    scrollable: string;
    clientX;
    clientY;
    tracking: boolean;
    boardWidth = 0;
    contentWidth = 0;
    startX;
    initialWindowWidth;
    initialWindowHeight;
    initialDocumentHeight;
    instructorThumbnails: Userthumbnail[];
    studentThumbnails: Userthumbnail[];
    minBoardWidth = 310;
    grabberStyle;
    showingSectionMenu: boolean;
    currentUser: User;
    offsetX;
    diff;
    grabberWidth;
    adjustment;
    COURSE_IMAGE_PATH: string;
    AVATAR_IMAGE_PATH: string;

    constructor( private router: Router,
    private activated_route: ActivatedRoute,
    private classService: ClassService,
    private courseService: CourseService,
    private userService: UserService,
    private materialService: MaterialService, private globals: Globals ) {
        this.initialWindowWidth = window.screen.width;
        this.boardWidth = this.initialWindowWidth * .3;
        this.contentWidth = this.initialWindowWidth * .6;

    }


    ngOnInit() {

        this.myInit();
        this.discussing = false;
        this.widthStyle = 'full';
        this.boardStyle = 'leftSide';
        this.mainStyle = 'full';
        this.grabberStyle = 'grabRight';
        this.scrollable = '';
        this.contentWidth = window.innerWidth;
        this.initialDocumentHeight = document.body.scrollHeight;
        if (!this.sectionNumber) { this.sectionNumber = 0; }
        // Refresh the currentUser's info from the DB
        this.userService.getUser( this.userService.currentUser.id ).subscribe ( user => {
            this.currentUser = user[0];
            // this.persistBoardSettings();
        } ,
            error => console.log(error)
        );

        this.myInit();

    }

    // persistBoardSettings() {
    //     if (this.currentUser && this.currentUser.boardsettings) {
    //         const side = this.currentUser.boardsettings.side;
    //         const width = this.currentUser.boardsettings.width;

    //         if (this.currentUser && this.currentUser.boardsettings) {
    //             if (this.currentUser.boardsettings.discussing === 'true') {
    //                 this.discussing = true;
    //             } else {
    //                 this.discussing = false;
    //             }
    //         }

    //         if (this.discussing) {
    //        // console.log('side' + side);
    //        // console.log('width' + width);
    //         switch (side) {
    //             case 'leftSide':
    //               this.establishLeft(width);
    //               break;
    //             case 'rightSide':
    //               this.establishRight( width );
    //               break;
    //             case 'fullSize':
    //               this.establishStack( width );
    //               break;
    //             default:
    //               break;
    //         }
    //       }
    //     }
    // }

    hideSectionMenu() {
        this.showingSectionMenu = false;
    }

    showSectionMenu() {
        this.showingSectionMenu = !this.showingSectionMenu;
    }
    closeDiscussion() {
     //   console.log('closing discussion');
        // this.widthStyle = 'full';
        this.discussing = false;
        // this.mainStyle = 'full';
        // this.scrollable = '';
        // this.contentWidth = window.innerWidth;
        // this.initialWindowHeight = this.initialDocumentHeight;
        // this.saveMyBoardSettings();
    }

    openDiscussion() {
       // this.boardWidth = window.innerWidth * .3;
        // this.contentWidth = window.innerWidth - this.boardWidth - 20;
        // console.log('contentWidth should be: ' + window.screen.width);
       //  this.widthStyle = 'divided';
        this.discussing = true;
      //  this.scrollable = 'scrollable';
       // this.initialWindowHeight = window.innerHeight;

        // if (this.boardStyle === 'rightSide') {
        //     this.moveRight();
        // } else {
        //     if (this.boardStyle === 'leftSide') {
        //         this.moveLeft();
        //     }
        // }
        // this.saveMyBoardSettings();
    }

    moveRight() {
        if (this.boardWidth < (window.innerWidth * .2)) {
        this.boardWidth = window.innerWidth * .3; }
        if (this.boardWidth > (window.innerWidth * .9)) {
            this.boardWidth = window.innerWidth * .3;
        }
        this.contentWidth = window.innerWidth - this.boardWidth - 20;
        this.boardStyle = 'rightSide';
        this.scrollable = 'scrollable';
        this.mainStyle = 'mainLeft';
        this.grabberStyle = 'grabLeft';
        this.initialWindowHeight = window.innerHeight;
        this.saveMyBoardSettings();
    }

    establishRight( newWidth ) {
        this.discussing = true;
        this.boardWidth = newWidth;
        this.contentWidth = window.innerWidth - this.boardWidth - 20;
        this.boardStyle = 'rightSide';
        this.scrollable = 'scrollable';
        this.mainStyle = 'mainLeft';
        this.grabberStyle = 'grabLeft';
        this.initialWindowHeight = window.innerHeight;
    }

    moveLeft() {
        this.boardWidth = window.innerWidth * .3;
        this.contentWidth = window.innerWidth - this.boardWidth - 20;
        this.boardStyle = 'leftSide';
        this.mainStyle = 'mainRight';
        this.scrollable = 'scrollable';
        this.grabberStyle = 'grabRight';
        this.initialWindowHeight = window.innerHeight;
        this.saveMyBoardSettings();
    }

    establishLeft( newWidth ) {
        this.discussing = true;
        this.boardWidth = newWidth - 20;
        this.contentWidth = window.innerWidth - this.boardWidth - 20;
        this.boardStyle = 'leftSide';
        this.mainStyle = 'mainRight';
        this.scrollable = 'scrollable';
        this.grabberStyle = 'grabRight';
        this.initialWindowHeight = window.innerHeight;
    }

    makeStacked() {
        this.boardStyle = 'fullSize';
        this.mainStyle = 'full';
        this.scrollable = 'scrollable';
        this.boardWidth = window.innerWidth - 20;
        this.contentWidth = window.innerWidth - 20;
        this.saveMyBoardSettings();
    }

    establishStack( newWidth ) {
        this.discussing = true;
        this.boardStyle = 'fullSize';
        this.mainStyle = 'full';
        this.scrollable = 'scrollable';
        this.boardWidth = window.innerWidth - 20;
        this.contentWidth = window.innerWidth - 20;
        this.initialWindowHeight = window.innerHeight;
        this.saveMyBoardSettings();
    }


    grab(event: MouseEvent) {
        this.tracking = true;
        this.clientX = event.clientX;
        this.clientY = event.clientY;
        this.startX = this.clientX;
        this.offsetX = document.getElementById('grabber').offsetLeft;
        this.grabberWidth = document.getElementById('grabber').clientWidth;
        this.diff = 0;
        if (this.offsetX) {
            this.diff = this.offsetX - this.clientX;
            if (this.boardStyle === 'leftSide') {
            this.adjustment = this.grabberWidth + this.diff + 20; } else {
                this.adjustment = 0 - (this.grabberWidth + this.diff);
            }
        }

        // console.log( 'offset x: ' + this.offsetX + ', clientX: ' + this.clientX );
       // console.log('width: ' + this.grabberWidth + ', diff: ' + this.diff);
     //  console.log('adjustment: ' + this.adjustment );
       // console.log(this.clientX);
       // this.boardWidth = 500;
      }

      trackGrab(event: MouseEvent) {

          if (this.tracking) {
           // console.log('tracking' + event.clientX);
            this.clientX = event.clientX;
            this.clientY = event.clientY;

            if (this.boardStyle === 'leftSide') {
                this.boardWidth = this.clientX + this.adjustment;
                if (this.boardWidth < this.minBoardWidth) {
                     this.boardWidth = this.minBoardWidth;
                 }
                // console.log('boardWidth: ' + this.boardWidth);
                 this.contentWidth = window.innerWidth - this.boardWidth - 20;
            } else {
              if (this.boardStyle === 'rightSide') {
                this.boardWidth = window.innerWidth - this.clientX - this.adjustment;
                this.contentWidth = window.innerWidth - this.boardWidth - 20;
              }
          }
        }
      }

      endGrab(event: MouseEvent) {

        if ( this.tracking ) {
        this.tracking = false;
        // this.saveMyBoardSettings();
      }
    }

      saveMyBoardSettings() {
        // if (this.boardWidth) {
        //     const boardSettings = <BoardSettings> { 'discussing' : this.discussing.toString(),
        //      'side' : this.boardStyle, 'width' : this.boardWidth.toString() };
        //      // I'm not really doing anything with the data that comes from this subscription.
        //   //  this.userService.storeBoardSettings( boardSettings ).subscribe( params => params, error => console.log(error) );
        //     }
    }

    myInit() {
    //    console.log('in class Init...');
        this.classID = this.activated_route.snapshot.params['id'];
        this.thisClass = this.activated_route.snapshot.data['thisClass'];
        this.users = this.activated_route.snapshot.data['users'];
        this.instructors = [];
        this.instructors = this.classService.getInstructors(this.thisClass, this.users);
      //  console.log('instructors: ' + JSON.stringify(this.users));
        this.students = [];
        this.students = this.classService.getStudents(this.thisClass, this.users);

        this.instructorThumbnails = this.instructors.map(this.createInstructorThumbnail);
        this.studentThumbnails = this.students.map(this.createStudentThumbnail);

        this.courseID = this.thisClass.course;
       // console.log('thisClass: ' + this.classID);
       // console.log('course: ' + this.courseID );
    //    this.sectionNumber = this.activated_route.snapshot.params['section'];
    //     if (this.sectionNumber === undefined) { this.sectionNumber = 0; }

        if (this.activated_route.snapshot.params['id2']) {
            this.sectionNumber = this.activated_route.snapshot.params['id2']; } else { this.sectionNumber = 0; }

        if (this.sectionNumber === undefined) {
                this.sectionNumber = 0;
             //   console.log('resetting sectionNumber to zero: ' + this.sectionNumber);
         }
         //   console.log('activated route section# ' + this.sectionNumber);
        this.activated_route.params.subscribe( params => {
         //   console.log ('params changed.');
            this.classID = params['id'];

            if (params['id2']) {
                this.sectionNumber = params['id2'];

              //  console.log('New Section# ' + this.sectionNumber);
                if (this.course && this.course.sections) {
                 //   console.log('Assigning new section # to: ' + this.sectionNumber);
                this.section = this.course.sections[this.sectionNumber];
            }

            }
        });
       this.subscribeToCourse();

    }

    subscribeToCourse() {
        this.courseService.getCourse(this.courseID).subscribe(
            course =>  {this.course = course[0];
            this.courseimageURL = this.globals.courseimages + '/' + this.courseID + '/' + this.course.image;

            if (!this.sectionNumber) { this.sectionNumber = 0; }
            if (this.course && this.course.sections) {
                this.section = this.course.sections[this.sectionNumber]; }

             //   console.log(' section Number ' + this.sectionNumber);
            this.loadInMaterials();

            },
                error => this.errorMessage = <any>error);
    }
    createInstructorThumbnail(user) {
        const thumbnailObj = { user: user, user_id: user.id, editable: false, inRoom: true,
            size: 100,  showUsername: true, showInfo: false, textColor: '#ffffff' };
        return thumbnailObj;
    }

    createStudentThumbnail(user) {
        const thumbnailObj = { user: user, user_id: user.id, editable: false, inRoom: true,
            size: 60,  showUsername: true, showInfo: false, textColor: '#ffffff' };
        return thumbnailObj;
    }

    nextSection() {
        this.sectionNumber++;
        if (this.sectionNumber > (this.course.sections.length - 1)) {
            this.sectionNumber = ( this.course.sections.length - 1);
        }
        this.section = this.course.sections[this.sectionNumber];

        const routeString = '/classes/' + this.classID + '/' + this.sectionNumber;
        this.router.navigate( [routeString] );
    }

    prevSection() {
        this.sectionNumber--;
        if (this.sectionNumber < 0 ) { this.sectionNumber = 0; }
        this.section = this.course.sections[this.sectionNumber];

        const routeString = '/classes/' + this.classID + '/' + this.sectionNumber;
        this.router.navigate( [routeString] );

    }
    populateForm() {

    }
    ngOnChanges() {
        this.section = this.course.sections[this.sectionNumber];

       // this.myInit();
    }

    ngDoCheck() {
        // if (this.activated_route.snapshot.params['section']) {
        // this.section = this.activated_route.snapshot.params['section']; }
        // console.log('activated route section# ' + this.section);
        // if (this.section === undefined) {
        //     this.section = 0;
        // }
    }

    navigateTo(sectionNumber) {
      console.log('will navigate to: ' + sectionNumber);
     this.showingSectionMenu = false;
     this.sectionNumber = sectionNumber;
     this.section = this.course.sections[this.sectionNumber];
     const routeString = '/classes/' + this.classID + '/' + this.sectionNumber;
        this.router.navigate([routeString]);
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


