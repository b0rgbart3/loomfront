import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { ClassService } from '../classes/class.service';
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

  @Input() thread: Thread;
  @Output() threadChange = new EventEmitter<Thread>();

  constructor( private activated_route: ActivatedRoute,
    private classService: ClassService,
    private userService: UserService,
    private fb: FormBuilder,
    private ds: DiscussionService ) {}

  ngOnInit() {
    this.post_date = this.thread.post_date;
    if (this.post_date) {
    this.display_date = this.post_date.toString(); }
    this.currentUser = this.userService.getCurrentUser();
    // console.log('Current User: ' + JSON.stringify(this.currentUser));
    // console.log('thread: ' + JSON.stringify(this.thread));
    this.thread.displayReplyInput = false;
    this.userService.getUser(this.thread.user_id).subscribe(
        user => {this.user = user[0];
          this.userThumbnail = { user: this.user, user_id: this.user.id, editable: false,
            inRoom: true, size: 50, showUsername: false, showInfo: false };
            console.log('got real user info back.');
          this.createReplyThumbnails();
          // console.log('This thread: ' + JSON.stringify(this.thread));
        },
        error => this.errorMessage = <any>error);

        this.replyFormGroup = this.fb.group( { reply : '' } );
      console.log('current state: ' + this.thread.displayReplyInput);
    }
  ngOnChanges() {
    console.log('thread changed.');
  }

  createReplyThumbnails() {
    this.replyThumbnails = [];
    if (this.thread.replies) {
    this.replyThumbnails = this.thread.replies.map(this.createThumbnail); }
   //  console.log('thread.replies:' + JSON.stringify(this.thread.replies));
   // console.log('replyThumbnails: ' + JSON.stringify(this.replyThumbnails));
  }

  createThumbnail(user) {
    const thumbnailObj = { user: null, user_id: user.user_id, editable: false, inRoom: true,
      size: 50, showUsername: false, showInfo: false };
    return thumbnailObj;
  }

  createLiveThumbnail(user) {
    const thumbnailObj = { user: this.currentUser, user_id: user.user_id, editable: false, inRoom: true,
      size: 50, showUsername: false, showInfo: false };
    return thumbnailObj;
  }

  reply(thread) {
    this.thread.displayReplyInput = true;
    // this.threadChange.emit(this.thread);
  }

  cancel(thread) {
    this.thread.displayReplyInput = false;
  }

  toggleThread() {
    this.thread.collapsed = !this.thread.collapsed;
  }

  killReply(r) {
    if (r > -1) {
      const cd = confirm('Are you sure you want to delete this reply?');
      if (cd) {
      this.thread.replies.splice(r, 1); }
    }
    this.threadChange.emit(this.thread);
  }


  submitReply(thread) {
    // console.log(this.replyFormGroup.get('reply').value);
    const reply = this.replyFormGroup.get('reply').value;
    if (!this.thread.replies) {
      this.thread.replies = [];
    }
    if (this.currentUser) {
      const replyObject = { user_id: this.currentUser.id, reply: reply };
      this.thread.replies.push(replyObject);
      this.replyThumbnails.push(this.createLiveThumbnail(this.currentUser.id));
      this.thread.displayReplyInput = false;

      this.ds.updateThread( this.thread ).subscribe(
        (val) => { }, response => {
          // this.threadChange.emit(this.thread);
          this.thread.displayReplyInput = false;
          
          // this.createReplyThumbnails();
        }// console.log('thread saved')
        ,
          () => { // console.log('finished');
          this.replyFormGroup.reset();
        this.thread.displayReplyInput = false;
        // this.createReplyThumbnails();
       });




    } else {
      console.log('couldnt find the current user');
    }

  }



}
