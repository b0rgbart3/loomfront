import { Component, OnInit, DoCheck, OnChanges, EventEmitter, Output } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { User } from '../../models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassModel } from '../../models/class.model';
import { ClassService } from '../../services/class.service';
import { UserService } from '../../services/user.service';
import { ContentChart } from '../../models/contentchart.model';
import { Section } from '../../models/section.model';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../models/material.model';
import { Userthumbnail } from '../../models/userthumbnail.model';
import { BoardSettings } from '../../models/boardsettings.model';
import { Globals } from '../../globals2';
import { MaterialCollection } from '../../models/materialcollection.model';
import { DiscussionSettings } from '../../models/discussionsettings.model';
import { DiscussionService } from '../../services/discussion.service';
import { EnrollmentsService } from '../../services/enrollments.service';
import { NotesSettings } from '../../models/notessettings.model';
import { ClickOutsideDirective } from '../../_directives/clickOutside.directive';
import { MessageService } from '../../services/message.service';
import { AssignmentsService } from '../../services/assignments.service';
import { Enrollment } from '../../models/enrollment.model';
import { Assignment } from '../../models/assignment.model';
import { MaterialSet } from '../../models/materialset.model';
import { Announcements } from '../../models/announcements.model';
import { AnnouncementsService } from '../../services/announcements.service';

@Component({

  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css', './bios.css'],
  providers: [CourseService]
})

export class ClassComponent implements OnInit {

   // @Output() sendMsg: EventEmitter<{}> = new EventEmitter<{}>();
    classID: string;
    thisClass: ClassModel;
    errorMessage: string;
    classes: ClassModel[];
    currentCourse: Course;
    courseMaterials: Material[];
    courseimageURL: string;
    users: User[];
    instructors: User[];
    studentIDList: string[];
    students: User[];
    instructorIDList: string[];
    instructorCount= 0;
    studentCount= 0;
    materials = [];
    sectionNumber: number;
    section: Section;
    instructorThumbnails: Userthumbnail[];
    studentThumbnails: Userthumbnail[];
    studentBioThumbnails: Userthumbnail[];
    showingSectionMenu: boolean;
    showingAnnouncementsMenu: boolean;
    showingAnnouncements: boolean;
    showingAnnouncementsForm: boolean;
    currentUser: User;
    currentUserIsInstructor: boolean;
    COURSE_IMAGE_PATH: string;
    AVATAR_IMAGE_PATH: string;
    discussionSettings: DiscussionSettings;
    classMaterials: Material[];
    notesSettings: NotesSettings;
    messaging: boolean;
    enrollments: Enrollment[];
    assignments: Assignment[];
    materialSets: MaterialSet[][];
    currentMaterials: MaterialSet[];
    announcements: Announcements[];
    currentAnnouncement: Announcements;
  
    // for the BIO Popup
    bioChosen: User;
    showingBio: boolean;

    constructor( private router: Router,
    private activated_route: ActivatedRoute,
    private classService: ClassService,
    private courseService: CourseService,
    private userService: UserService,
    private materialService: MaterialService,
    private discussionService: DiscussionService,
    private enrollmentsService: EnrollmentsService,
    private assignmentsService: AssignmentsService,
    private messageService: MessageService,
    private globals: Globals,
private announcementsService: AnnouncementsService ) {
    }

   clean(thisArray, deleteValue): any[] {
        for (let i = 0; i < thisArray.length; i++) {
          if (thisArray[i] === deleteValue) {
            thisArray.splice(i, 1);
            i--;
          }
        }
        return thisArray;
      }

    ngOnInit() {

        this.currentMaterials = null;
        this.messaging = false;
        this.currentUser = this.userService.getCurrentUser();
        this.currentUserIsInstructor = false;

        this.activated_route.params.subscribe(params => {
            this.onSectionChange(params['id2']);

                 // Grab the data from the Route
            this.classID = this.activated_route.snapshot.params['id'];
            this.thisClass = this.activated_route.snapshot.data['thisClass'];
            this.users = this.activated_route.snapshot.data['users'];
            this.sectionNumber = this.activated_route.snapshot.params['id2'];
            this.discussionSettings = this.activated_route.snapshot.data['discussionSettings'];
            this.notesSettings = this.activated_route.snapshot.data['notesSettings'];
            this.announcements = this.activated_route.snapshot.data['announcements'];
            console.log('Announcements: ' + this.announcements.length);
            this.currentUser = this.userService.getCurrentUser();
            console.log('This happens next');
        });

        this.activated_route.parent.data.subscribe(
            data => { this.onDataRetrieved(data['thisClass']); }
        );

        if (!this.sectionNumber) { this.sectionNumber = 0; }

        this.studentIDList = [];
        this.enrollmentsService.getEnrollmentsInClass( this.thisClass.id ).subscribe (
            data => { this.enrollments = data;
                this.students = this.enrollments.map( enrollment => this.userService.getUserFromMemoryById( enrollment.user_id ));
                this.studentThumbnails = this.students.map( student =>
                    this.createStudentThumbnail(student) );
            }, err => { console.log('error getting enrollments'); } );

        this.instructorIDList = [];
        this.assignmentsService.getAssignmentsInClass( this.thisClass.id ).subscribe (
            data => { this.assignments = data;
              this.instructors = this.assignments.map( assignment => this.userService.getUserFromMemoryById( assignment.user_id ));
              this.instructorThumbnails = this.instructors.map(
                instructor => this.createInstructorThumbnail(instructor) );
            }, err => { console.log('error getting assignments'); } );

        this.currentCourse = this.activated_route.snapshot.data['thisCourse'];
        this.courseimageURL = this.globals.courseimages + '/' + this.currentCourse.id
        + '/' + this.currentCourse.image;

        this.classMaterials = this.activated_route.snapshot.data['classMaterials'];

        this.buildMaterialSets();
        this.currentMaterials = this.materialSets[this.sectionNumber];

        this.activated_route.params.subscribe( params => {

            // We subscribe to the parameters, in case the section # changes,
            // because we'll need to update some of our data accordingly if it does

            if (params['id2']) {
                this.sectionNumber = params['id2'];

                if (this.currentCourse && this.currentCourse.sections) {

                this.section = this.currentCourse.sections[this.sectionNumber];
                this.currentMaterials = this.materialSets[this.sectionNumber];
            }

            }
        });

    }

    gotoEditor() {
        if (this.currentUser && this.currentUser.admin) {
            this.router.navigate( ['/admin/courseObjects/' + this.thisClass.course + '/edit'] );
        }
    }
    // This is where we look through ALL the materials - and group them into sets, if need be
    // for books and docs  (The only reason for doing this is that it is more aesthetically pleaseing
    // to have them grouped in clusters when they are displayed on the page ).
    buildMaterialSets() {
        this.materialSets = [];
        for (let j = 0; j < this.classMaterials.length; j++) {
            this.materialSets[j] = [];
            for (let i = 0; i < +this.classMaterials[j].length; i++) {
                let material = this.classMaterials[j][i];
                if (material) {
                    const aMaterialSet = new MaterialSet( false, material.type, []);

                    if ( (material.type === 'book') ) {
                        const first = i;
                        // collect books and documents together into sets of up to 4
                        while (( material && (material.type === 'book' ) )
                        && (i < first + 4 ) && (i < +this.classMaterials[j].length)) {
                            // its only a group if is more than one - so this only happens after the 2nd time
                            if (i > first) { aMaterialSet.group = true; }
                            aMaterialSet.materials.push(this.classMaterials[j][i]);
                            i++;
                            material = this.classMaterials[j][i];
                        }
                        if (i > first) { i--; }

                    } else {
                    if ( (material.type === 'doc') ) {
                        const first = i;
                        // collect books and documents together into sets of up to 4
                        while (( material && (material.type === 'doc') )
                        && (i < first + 4 ) && (i < +this.classMaterials[j].length)) {
                            if (i > first) { aMaterialSet.group = true;  }// its only a group if is more than one
                            aMaterialSet.materials.push(this.classMaterials[j][i]);
                            i++;
                            material = this.classMaterials[j][i];
                        }
                        if (i > first) { i--; }

                    } else {
                    // If it's not a book or a doc - then we don't need to group it
                    if ( (material.type !== 'doc') && (material.type !== 'book')) {
                        aMaterialSet.materials.push(material);
                    } } }
                    this.materialSets[j].push(aMaterialSet);
                }
            }
        }
    }
    showBio(user) {
        if (!this.showingBio) {
        this.bioChosen = user;
        this.showingBio = true; }
    }
    closeBio(event) {
        this.showingBio = false;
    }

    message(student) {
      //  this.hideMenu(student);
        this.messageService.sendMessage(student);
    }

    onSectionChange(newSectionNumber) {
        this.sectionNumber = newSectionNumber;
        this.discussionSettings = this.activated_route.snapshot.data['discussionSettings'];
        this.notesSettings = this.activated_route.snapshot.data['notesSettings'];
    }

    onDataRetrieved(newClassObject) {
        this.thisClass = newClassObject;
    }

    showAnnouncementsMenu() {
        this.showingAnnouncementsMenu = !this.showingAnnouncementsMenu;
    }

    hideAnnouncementsMenu() {
        this.showingAnnouncementsMenu = false;
    }

    hideSectionMenu() {
        this.showingSectionMenu = false;
    }

    showSectionMenu() {
        this.showingSectionMenu = !this.showingSectionMenu;
    }

    createInstructorThumbnail(user) {
        if (user.id === this.currentUser.id) {
            this.currentUserIsInstructor = true;
        }
        const thumbnailObj = { user: user, user_id: user.id, online: false,
            size: 100,  showUsername: true, showInfo: false, textColor: '#ffffff', border: false, shape: 'circle' };
        return thumbnailObj;
    }

    createStudentThumbnail(user) {
        if (user) {
        const thumbnailObj = { user: user, user_id: user.id, online: false,
            size: 60,  showUsername: true, showInfo: false, textColor: '#ffffff', border: false, shape: 'circle' };
        return thumbnailObj; } else {
            return null;
        }
    }

    displayAnnouncement( t ) {
        this.showingAnnouncements = true;
        this.currentAnnouncement = this.announcements[t];
    }

    hideAnnouncements() {
        this.showingAnnouncements = false;
    }

    nextSection() {
        this.sectionNumber++;
        if (this.sectionNumber > (this.currentCourse.sections.length - 1)) {
            this.sectionNumber = ( this.currentCourse.sections.length - 1);
        }
        this.section = this.currentCourse.sections[this.sectionNumber];
        this.currentMaterials = this.materialSets[this.sectionNumber];
        console.log('current Materials' + JSON.stringify(this.currentMaterials));
        const routeString = '/classes/' + this.classID + '/' + this.sectionNumber;
        this.router.navigate( [routeString] );

    }

    prevSection() {
        this.sectionNumber--;
        if (this.sectionNumber < 0 ) { this.sectionNumber = 0; }
        this.section = this.currentCourse.sections[this.sectionNumber];
        this.currentMaterials = this.materialSets[this.sectionNumber];
        const routeString = '/classes/' + this.classID + '/' + this.sectionNumber;
        this.router.navigate( [routeString] );

    }

    navigateTo(sectionNumber) {
     this.showingSectionMenu = false;
     this.sectionNumber = sectionNumber;
     this.currentMaterials = this.materialSets[this.sectionNumber];
     this.section = this.currentCourse.sections[this.sectionNumber];
     const routeString = '/classes/' + this.classID + '/' + this.sectionNumber;
        this.router.navigate([routeString]);
    }

    makeAnnouncement() {
        this.showingAnnouncementsForm = true;
    }
    closeAnnoucementsForm( event ) {
        this.showingAnnouncementsForm = false;
        // If we got an Announcments object back, then let's add it to our current list of announcements.
        if (event) {
            console.log('This is the event / Announcment we got back: ' + JSON.stringify(event));
            this.announcements.push(event); }
    }
    deleteAnnouncement() {
        console.log('About to deete Announcement with id of: ' + this.currentAnnouncement.id);

        this.announcementsService.delete( this.currentAnnouncement.id ).subscribe(
            (data) => {
                console.log('Got back from the Announcement Service, after deleting.');
                this.showingAnnouncements = false;
                const index = this.announcements.indexOf(this.currentAnnouncement);
                console.log('Announcements: ' + JSON.stringify(this.announcements));
                console.log('index: ' + index);
                this.announcements.splice(index, 1);
            },
          error => {
              this.errorMessage = <any>error;
              console.log('Got back from the Announcement Service, with error deleting.');
              // This is a work-around for a HTTP error message I was getting even when the
              // course was successfully deleted.
              if (error.status === 200) {
                console.log('But this is one of those bogus errors');
                this.showingAnnouncements = false;
                const index = this.announcements.indexOf(this.currentAnnouncement);
                console.log('Announcements: ' + JSON.stringify(this.announcements));
                console.log('index: ' + index);
                this.announcements.splice(index, 1);

               // this.router.navigate(['/coursebuilder']);
              } else {
             console.log('Error: ' + JSON.stringify(error) ); }
        } );

    }

}


