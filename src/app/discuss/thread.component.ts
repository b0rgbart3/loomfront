import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ClassService } from '../classes/class.service';
import { ClassModel } from '../models/class.model';
import { User } from '../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../users/user.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Thread } from '../models/thread.model';
import { DiscussionService } from '../services/discussion.service';


@Component({
  selector: 'thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css'],
  providers: [ClassService]
})

export class ThreadComponent implements OnInit {

  user: User;
  subject: string;
  user_id: string;
  errorMessage: string;
  displayReplyInput: boolean;
  replyFormGroup: FormGroup;
  currentUser: User;
  post_date: Date;
  display_date: string;

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
    this.displayReplyInput = false;
    this.userService.getUser(this.thread.user_id).subscribe(
        user => this.user = user[0],
        error => this.errorMessage = <any>error);

        this.replyFormGroup = this.fb.group( { reply : '' } );
    }

  reply(thread) {
    this.thread.displayReplyInput = true;
  }

  cancel(thread) {
    this.thread.displayReplyInput = false;
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
      this.displayReplyInput = false;

      this.ds.updateThread( this.thread ).subscribe(
        (val) => { }, response => console.log('thread saved')
        ,
          () => { console.log('finished'); this.replyFormGroup.reset();
        this.thread.displayReplyInput = false;
       });



    } else {
      console.log('couldnt find the current user');
    }

  }

}
