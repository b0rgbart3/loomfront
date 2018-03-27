import { Component, OnInit, DoCheck, OnChanges, EventEmitter, Output, Input } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { User } from '../../models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Userthumbnail } from '../../models/userthumbnail.model';
import { DiscussionSettings } from '../../models/discussionsettings.model';
import { DiscussionService } from '../../services/discussion.service';
import { EnrollmentsService } from '../../services/enrollments.service';
import { ClickOutsideDirective } from '../../_directives/clickOutside.directive';

@Component({

  selector: 'biopop',
  templateUrl: './biopop.component.html',
  styleUrls: ['./biopop.component.css'],

})



export class BioPopComponent implements OnInit, OnChanges {

@Input() bioUser: User;
@Input() allowMessage: boolean;
@Output() closeMe = new EventEmitter<boolean>();
@Output() messageMe = new EventEmitter<User>();
clicks: number;
constructor() {

}

thumbnail: Userthumbnail;
    ngOnInit() {
      this.clicks = 0;
      this.makeThumb();
      if (this.allowMessage !== false) {
        this.allowMessage = true;
      }
    }

    makeThumb() {
      this.thumbnail = { user: this.bioUser, user_id: this.bioUser.id, online: false,
        size: 220,  showUsername: false, showInfo: false, textColor: '#ffffff', border: true, shape: 'circle' };
    }
    closer() {
      this.closeMe.emit(true);
    }

    checkMe() {
      this.clicks++;
      if (this.clicks > 1) {
        this.closer();
      }
    }
    ngOnChanges() {
      this.thumbnail = null;
      this.makeThumb();

    }
    message(thumbnail) {
      this.messageMe.emit(thumbnail);
    }
  }
