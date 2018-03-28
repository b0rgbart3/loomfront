import { Component, OnInit, Output, Input, OnChanges, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../models/course.model';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../models/material.model';
import { Section } from '../../models/section.model';
import { MaterialCollection } from '../../models/materialcollection.model';
import { Book } from '../../models/book.model';
import { Doc } from '../../models/doc.model';
import { ClassModel } from '../../models/class.model';
import { UserService } from '../../services/user.service';
import { DiscussionService } from '../../services/discussion.service';
import { DiscussionSettings } from '../../models/discussionsettings.model';
import { User } from '../../models/user.model';
import { NotesSettings } from '../../models/notessettings.model';
import { MaterialSet } from '../../models/materialset.model';

@Component({
    moduleId: module.id,
    selector: 'section',
    templateUrl: 'section.component.html',
    styleUrls: ['section.component.css'],
})


export class SectionComponent implements OnInit, OnChanges {

    title: string;
    content: string;

    @Input() thisClass: ClassModel;
    @Input() course: Course;
    @Input() section: Section;
    @Input() students: User[];
    @Input() instructors: User[];
    @Input() discussionSettings: DiscussionSettings;
    @Input() notesSettings: NotesSettings;
    @Input() materialSets: MaterialSet[];

    public books: Material [];
    public docs: Material [];
    errorMessage: string;
    constructor (private materialService: MaterialService,
        private discussionService: DiscussionService,
        private userService: UserService,
        ) {}

    ngOnInit() {

       // console.log('In Section INit: ' + JSON.stringify(this.materialSets));
      //  this.initMe();
    }

    initMe() {

     //   console.log('In section init: discussionSettings: ' +
       //  JSON.stringify(this.discussionSettings));
        // this.materialCollection = null;
       // this.section = this.course.sections[this.section.sectionNumber];

        // const sortedMaterials = this.materialService.sortMaterials(this.materials);
        // this.materialCollection = sortedMaterials;

    }

    ngOnChanges() {
      //  console.log('In Section Init: Materials: ' + JSON.stringify(this.materials));
        // console.log('somethign changeD: ' + this.sectionNumber);
        // this.discussionService.getDiscussionSettings(this.userService.currentUser.id,
        //     this.thisClass.id, this.sectionNumber).
        // map(dsObject => { if (dsObject) {
        //     console.log('found existing ds object.');
        // this.discussionSettings = dsObject; } else {
        //         console.log('did not find ds object, so creating one.');
        //         const newDSObject = new DiscussionSettings( this.userService.currentUser.id,
        //             this.thisClass.id, this.sectionNumber + '', false, []);
        // const returnableArray = [];
        // returnableArray.push(newDSObject);
        // console.log('returning: ' + JSON.stringify(returnableArray));
        // return returnableArray;
        //     } });
        // this.initMe();
     }


}

