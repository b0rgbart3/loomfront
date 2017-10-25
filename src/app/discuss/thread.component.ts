import { Component, OnInit, Input } from '@angular/core';
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

  @Input() thread: Thread;

  constructor( private activated_route: ActivatedRoute,
    private classService: ClassService,
    private userService: UserService,
    private fb: FormBuilder,
    private ds: DiscussionService ) {}

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    console.log('Current User: ' + JSON.stringify(this.currentUser));
    // console.log('thread: ' + JSON.stringify(this.thread));
    this.displayReplyInput = false;
    this.userService.getUser(this.thread.user_id).subscribe(
        user => this.user = user[0],
        error => this.errorMessage = <any>error);

        this.replyFormGroup = this.fb.group( { reply : '' } );
    }

  reply(thread) {
    this.displayReplyInput = true;
  }

  cancel() {
    this.displayReplyInput = false;
  }

  submitReply() {
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
          () => { console.log('finished'); });



    } else {
      console.log('couldnt find the current user');
    }

  }

}
