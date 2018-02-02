import { Component, OnInit, Output, Input, OnChanges } from '@angular/core';
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





@Component({
    moduleId: module.id,
    selector: 'section',
    templateUrl: 'section.component.html',
    styleUrls: ['section.component.css']
})


export class SectionComponent implements OnInit, OnChanges {
    materialCollection: MaterialCollection;
    title: string;
    content: string;
    discussing: boolean;
    discussionIconClass: string;

    @Input() thisClass: ClassModel;
    @Input() course: Course;
    @Input() materials: Material[];
    @Input() sectionNumber: number;
    public books: Material [];
    public docs: Material [];
    errorMessage: string;
    section: Section;

    constructor (private materialService: MaterialService,
        private discussionService: DiscussionService,
        private userService: UserService ) {}

    ngOnInit() {

        this.initMe();
    }

    initMe() {
        this.discussionIconClass = 'discussionIcon';
        this.materialCollection = null;
       // this.discussing = false;
        this.section = this.course.sections[this.sectionNumber];

        const sortedMaterials = this.materialService.sortMaterials(this.materials);
        this.materialCollection = sortedMaterials;
        this.loadUserDiscussionSettings();
       // console.log('course: ' + this.course.title);
       // console.log('sectionNumber: ' + this.sectionNumber);
    }

    ngOnChanges() {
       // console.log('CHANGE');
        this.initMe();
     }

  toggleDiscussion() {
      if (this.discussing) {
          this.closeDiscussion();
      } else {
          this.openDiscussion();
      }
  }
   openDiscussion() {
     this.discussing = true;
     this.saveDiscussionSettings();
     this.discussionService.introduceMyself( this.userService.currentUser, this.thisClass.id, this.sectionNumber);
     this.discussionIconClass = 'closeDiscussionIcon';
 }

 closeDiscussion() {
       this.discussing = false;
       this.saveDiscussionSettings();
       this.discussionIconClass = 'discussionIcon';
   }

   saveDiscussionSettings() {
    const discussionSettingsObject = { 'user_id': this.userService.currentUser.id,
        'classID': this.thisClass.id, 'section': this.sectionNumber, 'discussing': this.discussing };
    this.discussionService.storeDiscussionSettings(discussionSettingsObject).subscribe(
        data => console.log('done storing discussion settings.'), error => {
            console.log('ERROR trying to store the settings!');
            console.log(error); } );

   }

   loadUserDiscussionSettings() {
    this.discussionService.getDiscussionSettings( this.userService.currentUser.id, this.thisClass.id, this.sectionNumber ).subscribe(
        (data) => {
            this.discussing = false;
           if (data) { this.discussing = data.discussing;
            if (data.discussing) { this.discussionIconClass = 'closeDiscussionIcon'; } else {
                this.discussionIconClass = 'discussionIcon';
            }
        }
           // console.log('DISCUSSION OBJECT:');
          //  console.log( JSON.stringify(data));

        }, (error) => console.log(error) );

}
   saveMyBoardSettings() {
    // if (this.boardWidth) {
    //     const boardSettings = <BoardSettings> { 'discussing' : this.discussing.toString(),
    //      'side' : this.boardStyle, 'width' : this.boardWidth.toString() };
    //      // I'm not really doing anything with the data that comes from this subscription.
    //   //  this.userService.storeBoardSettings( boardSettings ).subscribe( params => params, error => console.log(error) );
    //     }
}



}

