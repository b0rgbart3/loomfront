import { Component, OnInit, Input } from '@angular/core';
import { ClassService } from '../classes/class.service';
import { ClassModel } from '../models/class.model';
import { User } from '../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../users/user.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Thread } from '../models/thread.model';
import { DiscussionService } from '../services/discussion.service';


@Component({
  selector: 'discussion',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  providers: [ClassService]
})

export class BoardComponent implements OnInit {

  classes: ClassModel[];
  selectedClass: {};
  errorMessage: string;
  currentUser: User;
  admin: boolean;
  classID: number;
  thisClass: ClassModel;
  users: User[];
  discussionFormGroup: FormGroup;
  thread: Thread;
  threads: Thread[];

  @Input() class: ClassModel;

  constructor( private router: Router,
    private activated_route: ActivatedRoute,
    private classService: ClassService,
    private userService: UserService,
    private fb: FormBuilder,
    private ds: DiscussionService ) {}

  ngOnInit() {
    this.classID = +this.activated_route.snapshot.params['id'];
    this.thisClass = this.activated_route.snapshot.data['thisClass'][0];
    this.users = this.activated_route.snapshot.data['users'];
    this.currentUser = this.userService.getCurrentUser();

    this.discussionFormGroup = this.fb.group( { 'subject': '' } );

    this.ds.getThreads().subscribe(
      threads => this.threads = threads,
      error => this.errorMessage = <any>error);


    // this.thread = { user_id: '1', classID: this.classID, id: 1, post_date: new Date( Date.now() ),
    //   subject: 'This is the first topic of conversation', replies: <any> [] } ;
    // this.threads = [];
    // this.threads.push(this.thread);

    console.log(JSON.stringify( this.threads ));
  }

  backToClass() {
    this.router.navigate(['/classes']);
  }
  newThread(): void {

    const combinedObject = Object.assign( {}, this.thread, this.discussionFormGroup.value);
    combinedObject.classID = this.classID;
    combinedObject.user_id = this.currentUser.id;

    console.log('About to post: ' + JSON.stringify( combinedObject ) );

    this.ds.newThread( combinedObject ).subscribe(
      (val) => { }, response => console.log('thread saved')
      ,
        () => { console.log('finished'); });
  }


}
