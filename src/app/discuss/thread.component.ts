import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { ClassService } from '../services/class.service';
import { ClassModel } from '../models/class.model';
import { User } from '../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Thread } from '../models/thread.model';
import { DiscussionService } from '../services/discussion.service';
import { Userthumbnail } from '../models/userthumbnail.model';


@Component({
  selector: 'thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css'],
  providers: [ClassService]
})

export class ThreadComponent implements OnInit, OnChanges {

  user: User;
  subject: string;
  user_id: string;
  errorMessage: string;
  replyFormGroup: FormGroup;
  currentUser: User;
  post_date: Date;
  display_date: string;
  public userThumbnail: Userthumbnail;
  public replyThumbnails: Userthumbnail[];
  threadSubjectClass: string;

  @Input() thread: Thread;
  @Input() collapsed: boolean;
  @Output() threadChange = new EventEmitter<Thread>();
  @Output() deleteReply = new EventEmitter<Thread>();
  @Output() foldChange = new EventEmitter<Thread>();

  constructor( private activated_route: ActivatedRoute,
    private classService: ClassService,
    private userService: UserService,
    private fb: FormBuilder,
    private ds: DiscussionService ) {}

  ngOnInit() {

    // console.log('In the INIT of the thread component.');
   // console.log('My collapsed value == ' + this.collapsed);

    // not quite sure why I have both of these
    // but let's at least get them in sync
    this.thread.collapsed = this.collapsed;

    this.post_date = this.thread.post_date;
    if (this.post_date) {
    this.display_date = this.post_date.toString(); }
    this.currentUser = this.userService.getCurrentUser();
    // console.log('Current User: ' + JSON.stringify(this.currentUser));
    // console.log('thread: ' + JSON.stringify(this.thread));
    this.thread.displayReplyInput = false;
    this.user = this.userService.getUserFromMemoryById(this.thread.user_id);
    this.createReplyThumbnails();
    this.userThumbnail = this.createLiveThumbnail( this.thread.user_id );
    this.threadSubjectClass = 'threadSubjectClass group';

    if (this.thread.replies && this.thread.replies.length > 0) {
      this.threadSubjectClass = 'threadSubject threadSubjectCollapseable group';
    }
        this.replyFormGroup = this.fb.group( { reply : '' } );
      // console.log('current state: ' + this.thread.displayReplyInput);
    }
  ngOnChanges() {
   // console.log('thread changed.');
  }

  createReplyThumbnails() {
    this.replyThumbnails = [];
    if (this.thread.replies) {
    this.replyThumbnails = this.thread.replies.map(
      reply => { return { user: this.userService.getUserFromMemoryById(reply.user_id),
         user_id: reply.user_id, online: false,
      size: 40, showUsername: false, showInfo: false, textColor: '#000000', border: false, shape: 'circle' };  }); }
   // console.log('thread.replies:' + JSON.stringify(this.thread.replies));
   // console.log('replyThumbnails: ' + JSON.stringify(this.replyThumbnails));
  }

  // createThumbnail(reply) {
  //   const thumbnailObj = { user: null, user_id: reply.user_id, editable: false, inRoom: true,
  //     size: 40, showUsername: false, showInfo: false, textColor: '#000000' };
  //   return thumbnailObj;
  // }

  createLiveThumbnail(user_id) {
    const thisUser = this.userService.getUserFromMemoryById(user_id);
    const thumbnailObj = { user: thisUser, user_id: user_id, online: false,
      size: 40, showUsername: false, showInfo: false, textColor: '#000000', border: false, shape: 'circle' };
    return thumbnailObj;
  }

  // reply(thread) {
  //   if (this.thread.collapsed) {
  //     this.thread.collapsed = false;
  //     this.foldChange.emit(thread);
  //   }
  //   this.thread.collapsed = false;
  //   this.thread.displayReplyInput = true;
  //  // this.threadChange.emit(this.thread);
  // }

  cancel(thread) {
    this.thread.displayReplyInput = false;
  }

  toggleThread() {
    console.log('toggle Thread.');
    this.thread.collapsed = !this.thread.collapsed;

    this.foldChange.emit(this.thread);

    if (this.thread.collapsed) {
      if (this.thread.replies && this.thread.replies.length > 0) {
        this.threadSubjectClass = 'threadSubject threadSubjectExpandable group';
      }
    } else {
      if (this.thread.replies && this.thread.replies.length > 0) {
        this.threadSubjectClass = 'threadSubject threadSubjectCollapseable group';
      }
    }
  }

  killReply(r) {
    if (r > -1) {
      const cd = confirm('Are you sure you want to delete this reply?');
      if (cd) {
      this.thread.replies.splice(r, 1); }
    }
    // console.log('About to delete the Reply');
    this.deleteReply.emit(this.thread);
  }



  submitReply(thread) {
    // console.log(this.replyFormGroup.get('reply').value);
    const reply = this.replyFormGroup.get('reply').value;

    if (reply) {
    thread.collapsed = false;

  //  console.log('ABOUT TO SUBMIT REPLY');
   // console.log(JSON.stringify( thread ));


    if (!thread.replies) {
      thread.replies = [];
    }
    if (this.currentUser) {
      const replyObject = { user_id: this.currentUser.id, reply: reply };

      thread.replies.push(replyObject);
      this.replyThumbnails.push(this.createLiveThumbnail(this.currentUser.id));
      thread.displayReplyInput = false;

   //   console.log('Thread component: About to submit a reply.');
   //   console.log( JSON.stringify( thread ));

      this.ds.updateThread( thread ).subscribe(
        (val) => { }, response => {

          console.log('In thread component:DONE UPDATING THE THREAD- after posting a reply');
          this.threadChange.emit(thread);
          thread.displayReplyInput = false;

          // this.createReplyThumbnails();
        }// console.log('thread saved')
        ,
          () => {

          this.replyFormGroup.reset();
        thread.displayReplyInput = false;
        // this.createReplyThumbnails();
       });




    } else {
     //  console.log('couldnt find the current user');
    }

  }

}

}
