import { Component, OnInit, Input, OnChanges, DoCheck } from '@angular/core';
import { ClassService } from '../classes/class.service';
import { ClassModel } from '../models/class.model';
import { User } from '../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Thread } from '../models/thread.model';
import { DiscussionService } from '../services/discussion.service';
import { Section } from '../models/section.model';


@Component({
  selector: 'discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css'],
  providers: [ClassService]
})

export class DiscussionComponent implements OnInit, OnChanges, DoCheck {

  classes: ClassModel[];
  selectedClass: {};
  errorMessage: string;
  currentUser: User;
  admin: boolean;
  classID: string;
  users: User[];
  discussionFormGroup: FormGroup;
  thread: Thread;
  threads: Thread[];


  @Input() thisClass: ClassModel;
  @Input() students: User[];
  @Input() instructors: User[];
  @Input() sectionNumber: number;

  constructor( private router: Router,
    private activated_route: ActivatedRoute,
    private classService: ClassService,
    private userService: UserService,
    private fb: FormBuilder,
    private ds: DiscussionService ) {}

  ngOnInit() {
    // this.classID = this.activated_route.snapshot.params['id'];
    // this.thisClass = this.activated_route.snapshot.data['thisClass'][0];
    // this.users = this.activated_route.snapshot.data['users'];
    console.log('discussion initing: ' + this.thisClass.id + ', ' + this.sectionNumber);
    this.currentUser = this.userService.getCurrentUser();

    this.discussionFormGroup = this.fb.group( { 'subject': ['', [Validators.required ] ] } );

    this.ds.getThreads( this.thisClass.id, this.sectionNumber ).subscribe(
      threads => this.threads = threads,
      error => this.errorMessage = <any>error);


    // this.thread = { user_id: '1', classID: this.classID, id: 1, post_date: new Date( Date.now() ),
    //   subject: 'This is the first topic of conversation', replies: <any> [] } ;
    // this.threads = [];
    // this.threads.push(this.thread);

    // console.log(JSON.stringify( this.threads ));

  }

  backToClass() {
    this.router.navigate(['/classes']);
  }
  ngOnChanges() {
    console.log('ch ch changin ' + this.thisClass.id + ', ' + this.sectionNumber);
    this.ds.getThreads( this.thisClass.id, this.sectionNumber ).subscribe(
      threads => this.threads = threads,
      error => this.errorMessage = <any>error);
  }
  ngDoCheck() {
    // console.log('Do checking!');
  }


  newThread(): void {

    console.log('About to create new Thread.');

    if (this.discussionFormGroup.valid && this.discussionFormGroup.dirty) {

      console.log('Form was valid and dirty.');
    const combinedObject = Object.assign( {}, this.thread, this.discussionFormGroup.value);
    combinedObject.classID = this.thisClass.id;
    combinedObject.user_id = this.currentUser.id;
    combinedObject.post_date = new Date( Date.now());
    combinedObject.sectionNumber = this.sectionNumber;

    this.threads.unshift(combinedObject);

    // console.log('About to post: ' + JSON.stringify( combinedObject ) );

    this.ds.newThread( combinedObject ).subscribe(
      (val) => { }, response => {console.log('thread saved');

     // console.log('Threads before: ' + JSON.stringify(this.threads));
      // this.threads.unshift(combinedObject);
      this.discussionFormGroup.reset(); }
      ,
        () => { console.log('finished');
       // this.threads.unshift(combinedObject);
        this.discussionFormGroup.reset();
       });
    } else {  console.log('Valid:' + this.discussionFormGroup.valid);
  console.log('Dirty:' + this.discussionFormGroup.dirty ); }

  // this.ds.getThreads( this.thisClass.id ).subscribe(
  //   threads => { this.threads = threads; console.log('Got new set of threads.');
  //   console.log('Threads after: ' + JSON.stringify(this.threads));
  // },
  //   error => this.errorMessage = <any>error);
  }

  threadChange( thisThread: Thread ) {
    console.log('got the emission');
    const combinedObject = thisThread;
    combinedObject.classID = this.classID;
    combinedObject.user_id = this.currentUser.id;
    // console.log('About to post: ' + JSON.stringify( combinedObject ) );

    this.ds.updateThread( combinedObject ).subscribe(
          (val) => { }, response => { console.log('thread saved'); }
          ,
            () => { console.log('finished'); });

    this.ds.getThreads( this.thisClass.id, this.sectionNumber ).subscribe(
              threads => { this.threads = threads; console.log('Got new set of threads.'); },
              error => this.errorMessage = <any>error);

  }
 deleteThread ( thisThread: Thread) {
   const conf = confirm('Are you sure you want to delete this discussion topic, and all of it\'s replies?');
   if (conf) {
  this.ds.deleteThread( thisThread ).subscribe(
    (val) => { console.log('thread being deleted.'); }, response => {console.log('thread deletion.');
    this.removeThread(thisThread); }
    ,
      () => { console.log('thread deletion finished'); this.removeThread(thisThread); });
  }
 }

  removeThread( thisThread: Thread ) {
    let foundIndex = 0;
    console.log( JSON.stringify(thisThread));
    for (let i = 0; i < this.threads.length; i++) {
      if (this.threads[i].id === thisThread.id) {
        foundIndex = i;
        console.log('found index');
      }
    }
    if (foundIndex > -1) {
      this.threads.splice(foundIndex, 1);
      const dummyThread = <Thread>{};
      this.threads.push(dummyThread);
      this.threads.pop();
      console.log('removed the thread');
  }
  }
}
