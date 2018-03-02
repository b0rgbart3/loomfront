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
import { Globals } from '../../globals';
import { MaterialCollection } from '../../models/materialcollection.model';
import { DiscussionSettings } from '../../models/discussionsettings.model';
import { DiscussionService } from '../../services/discussion.service';
import { EnrollmentsService } from '../../services/enrollments.service';
import { NotesSettings } from '../../models/notessettings.model';
import { ClickOutsideDirective } from '../../_directives/clickOutside.directive';
import { MessageService } from '../../services/message.service';

@Component({

  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css'],
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
    showingSectionMenu: boolean;
    currentUser: User;
    COURSE_IMAGE_PATH: string;
    AVATAR_IMAGE_PATH: string;
    discussionSettings: DiscussionSettings;
    classMaterials: MaterialCollection[];
    notesSettings: NotesSettings;
    messaging: boolean;

    constructor( private router: Router,
    private activated_route: ActivatedRoute,
    private classService: ClassService,
    private courseService: CourseService,
    private userService: UserService,
    private materialService: MaterialService,
    private discussionService: DiscussionService,
    private enrollmentService: EnrollmentsService,
    private messageService: MessageService,
    private globals: Globals ) {
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
        this.messaging = false;
        this.activated_route.params.subscribe(params => {
            this.onSectionChange(params['id2']);
        });

        this.activated_route.parent.data.subscribe(
            data => { this.onDataRetrieved(data['thisClass']); }
        );

        if (!this.sectionNumber) { this.sectionNumber = 0; }

        // Grab the data from the Route
        this.classID = this.activated_route.snapshot.params['id'];
        this.thisClass = this.activated_route.snapshot.data['thisClass'];
        this.users = this.activated_route.snapshot.data['users'];
        this.sectionNumber = this.activated_route.snapshot.data['sectionNumber'];
        this.discussionSettings = this.activated_route.snapshot.data['discussionSettings'];
        this.notesSettings = this.activated_route.snapshot.data['notesSettings'];
       // console.log('In class INit: discussionSettings: ' + JSON.stringify(this.discussionSettings));
       console.log('In class init: notesSettings: ' + JSON.stringify(this.notesSettings));

        this.studentIDList = [];
        this.studentIDList = this.enrollmentService.getStudentsInClass(this.thisClass.id);
        this.studentIDList = this.clean(this.studentIDList, undefined);
        this.students = this.studentIDList.map( student => this.userService.getUserFromMemoryById(student));

        this.instructorIDList = [];
        this.instructorIDList = this.enrollmentService.getInstructorsInClass(this.thisClass.id);
        this.instructorIDList = this.clean(this.instructorIDList, undefined);
        this.instructors = this.instructorIDList.map( instructor => this.userService.getUserFromMemoryById(instructor));

       // console.log('Students: ' + JSON.stringify(this.studentIDList) );
       // console.log('Instructors: ' + JSON.stringify(this.instructorIDList) );
        this.instructorThumbnails = this.instructors.map(
            instructor => this.createInstructorThumbnail(instructor) );
        this.studentThumbnails = this.students.map( student =>
            this.createStudentThumbnail(student) );

        // Since we can't load the course data in a resolver (no way to access the
        // course ID # from the class object except inside a component), we
        // instead, will subscribe to the course data here (this ngOnInit method
        // will get re-invoked if the user changes classes, so it's ok if we
        // only subscribe to it once, I think.)

        this.currentCourse = this.activated_route.snapshot.data['thisCourse'];
        this.courseimageURL = this.globals.courseimages + '/' + this.currentCourse.id
        + '/' + this.currentCourse.image;
        // console.log('currentCourse: ' + JSON.stringify(this.currentCourse));
       // this.loadCourse();
       // this.loadMaterials();

        this.classMaterials = this.activated_route.snapshot.data['classMaterials'];

        // console.log('Class Materials' + JSON.stringify(this.classMaterials));

        this.activated_route.params.subscribe( params => {

            // We subscribe to the parameters, in case the section # changes,
            // because we'll need to update some of our data accordingly if it does

            if (params['id2']) {
                this.sectionNumber = params['id2'];

                if (this.currentCourse && this.currentCourse.sections) {

                this.section = this.currentCourse.sections[this.sectionNumber];
                // this.discussionService.getDiscussionSettings
                // tslint:disable-next-line:comment-format
                //(this.userService.currentUser.id, this.classID, this.sectionNumber).subscribe(
                //     data => {if (data) { this.discussionSettings = data[0]; } },
                //     error => console.log('errror getting discussion settings.')
                // );
            }

            }
        });

    }

    message(student) {
        this.hideMenu(student);
        console.log('sending message');
        // this.messageService.launchMsg(student);
        // this.sendMsg.emit(student);
        this.messageService.sendMessage(student);
    }

    showIntructorMenu(instructor) {
        if (!instructor.hot) {
            this.instructorThumbnails.map( thumbnail => thumbnail.hot = false );
            if (this.userService.currentUser.id !== instructor.user.id) {
            instructor.hot = true; }
            console.log('showing menu');
            }
    }
    showMenu(student) {
        if (!student.hot) {
        this.studentThumbnails.map( thumbnail => thumbnail.hot = false );
        if (this.userService.currentUser.id !== student.user.id) {
        student.hot = true;
        }
        console.log('showing menu');
        }
    }

    hideMenu(student) {
        student.hot = false;
    }

    // openMessaging() {
    //     this.messaging = true;
    // }

    // closeMessaging() {
    //     this.messaging = false;
    // }
    // loadMaterials() {
    //     console.log('In loadMaterials()');
    //     console.log('currentCourse: ' + JSON.stringify(this.currentCourse.image));


    //          // It doesn't make sense to me to try to load in the materials based on the course ID
    //          // because the course ID is not stored in the material objects in the DB
    //          // (this was done intentionally so that the materials could be used in more
    //         // than one course -- so they are course agnostic shall we say).
    //         // Instead what we have is a list of ID's in each section, that need to get
    //         // their associated Material Objects loaded in.


    //        //  console.log('getting materials for course id: ' + this.currentCourse.id);

    //         //  this.materialService.getMaterials(this.currentCourse.id).subscribe (
    //         //      courseMaterials => {
    //         //          console.log('data from aPI:');
    //         //          console.log(JSON.stringify(courseMaterials));
    //         //         // this is a full, un-organized array of all the materials used in this course
    //         //         this.courseMaterials = courseMaterials;

    //         //         // the next step is to organize all of that courseMaterial into materialCollections
    //         //         // based on section #
    //         //         this.buildMaterialCollections();
    //         //     // since we've just loaded in the courseMaterials, let's go ahead and
    //         //     // organize them into collections for each section

    //         //     }, error => console.log(error) ); } );
    // }

    // buildMaterialCollections() {
    //     console.log('Materials: ');
    //     console.log(JSON.stringify(this.materials));
    //     this.materialCollections = [];
    //     for (let i = 0; i < this.currentCourse.sections.length; i++ ) {
    //         const thisSection = this.currentCourse.sections[i];
    //         const thisSectionList = [];
    //         for (let j = 0; j < thisSection.materials.length; j++ ) {
    //             const thisMatID = thisSection.materials[j];

    //             // now look for and grab the material object that has this id # from our components main material array,
    //             // and copy it into our collection-list for this section.
    //             for (let k = 0; k < this.courseMaterials.length; k++) {
    //                 if (this.courseMaterials[k].id === thisMatID) {
    //                     // found it.
    //                     thisSectionList.push(this.courseMaterials[i]); // copy it
    //                 }
    //             }
    //         }
    //         // after we've grouped all of the materials for this section into a list,
    //         // now we can send that list to the material Service to organize it into
    //         // a tidy material collection, which we will store in our component's array (MaterialCollections)

    //         if (thisSectionList) {
    //         const thisMaterialCollection = this.materialService.sortMaterials(thisSectionList);
    //         this.materialCollections.push(thisMaterialCollection);
    //         }
    //     }
    // }
    onSectionChange(newSectionNumber) {
        this.sectionNumber = newSectionNumber;
        this.discussionSettings = this.activated_route.snapshot.data['discussionSettings'];
        this.notesSettings = this.activated_route.snapshot.data['notesSettings'];
    }

    onDataRetrieved(newClassObject) {
        this.thisClass = newClassObject;
    }

    hideSectionMenu() {
        this.showingSectionMenu = false;
    }

    showSectionMenu() {
        this.showingSectionMenu = !this.showingSectionMenu;
    }

    createInstructorThumbnail(user) {
        const thumbnailObj = { user: user, user_id: user.id, editable: false, inRoom: true,
            size: 100,  showUsername: true, showInfo: false, textColor: '#ffffff', hot: false };
        return thumbnailObj;
    }

    createStudentThumbnail(user) {
        const thumbnailObj = { user: user, user_id: user.id, editable: false, inRoom: true,
            size: 60,  showUsername: true, showInfo: false, textColor: '#ffffff', hot: false };
        return thumbnailObj;
    }

    nextSection() {
        this.sectionNumber++;
        if (this.sectionNumber > (this.currentCourse.sections.length - 1)) {
            this.sectionNumber = ( this.currentCourse.sections.length - 1);
        }
        this.section = this.currentCourse.sections[this.sectionNumber];
        const routeString = '/classes/' + this.classID + '/' + this.sectionNumber;
        this.router.navigate( [routeString] );

    }

    prevSection() {
        this.sectionNumber--;
        if (this.sectionNumber < 0 ) { this.sectionNumber = 0; }
        this.section = this.currentCourse.sections[this.sectionNumber];
        const routeString = '/classes/' + this.classID + '/' + this.sectionNumber;
        this.router.navigate( [routeString] );

    }

    navigateTo(sectionNumber) {
     this.showingSectionMenu = false;
     this.sectionNumber = sectionNumber;
     this.section = this.currentCourse.sections[this.sectionNumber];
     const routeString = '/classes/' + this.classID + '/' + this.sectionNumber;
        this.router.navigate([routeString]);
    }
}


