import { Component, OnInit, Input, OnChanges, DoCheck } from '@angular/core';
import { ClassService } from '../services/class.service';
import { ClassModel } from '../models/class.model';
import { User } from '../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Thread } from '../models/thread.model';
import { DiscussionService } from '../services/discussion.service';
import { Section } from '../models/section.model';
import { ChatService } from '../chat/chat.service';
import { NotificationsService } from '../services/notifications.service';
import { Notification } from '../models/notifications.model';
import { DiscussionSettings } from '../models/discussionsettings.model';


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
  class_id: string;
  users: User[];
  discussionFormGroup: FormGroup;
  thread: Thread;
  threads: Thread[];
  newThreads: Thread[];
  entry: boolean;
  whosIn: any[];
  discussing: boolean;
  ready2display: boolean;


  @Input() thisClass: ClassModel;
  @Input() students: User[];
  @Input() instructors: User[];
  @Input() section: Section;
  @Input() sectionNumber: number;
  @Input() folds: boolean[];
  @Input() discussionSettings: DiscussionSettings;

  constructor( private router: Router,
    private activated_route: ActivatedRoute,
    private classService: ClassService,
    private userService: UserService,
    private fb: FormBuilder,
    private ds: DiscussionService,
    private notes: NotificationsService,
 ) {}

 sendNotice(data) {
  this.notes.add( new Notification( data.type, data.message, data.delay ) );

}

  ngOnInit() {
   // console.log('At Init of discussion component: ');
   // console.log('Folds: ' + JSON.stringify(this.folds));

    this.ready2display = false;
    this.discussing = false;
    this.currentUser = this.userService.getCurrentUser();
    this.discussionFormGroup = this.fb.group( { 'subject': ['', [Validators.required ] ] } );

    if (!this.folds) { this.folds = []; }
    // console.log('In discussion Component INIT: ');
    // console.log('discussionSettings: ' + JSON.stringify(this.discussionSettings));
    // console.log('this.thisClass.id: ' + this.thisClass.id);

    this.ds.getThreads( this.thisClass.id, this.discussionSettings.section ).subscribe(
      data => { this.threads = data;
      //  console.log('DONE loading threads: ' + JSON.stringify(threads));
        this.checkSequenceAndFolds();
      },
      error => this.errorMessage = <any>error);

    // Here we are 'subscribing' to the event notifications that are being broadcast from the API
    // Perhaps these subscriptions should be in the ds service instead
    // of putting them here?

    this.ds.userEntered.subscribe( data => {
     //  console.log('User entered: ' + JSON.stringify(data) );

      if ( (data.class_id === this.thisClass.id) && (data.section === this.discussionSettings.section)  ) {
        this.sendNotice( {type: 'info', message:
        [ data.user.username + ' has entered the discussion.' ], delay: 2000} );
      }
    });

    this.ds.threadAdded.subscribe( thread => {
       console.log('thread added: ' + JSON.stringify(thread) );
       console.log('thread.section =' + thread.section);
       console.log('this.section =' + JSON.stringify( this.section) );
      if ((this.thisClass.id === thread.class_id) && (thread.section === this.sectionNumber)
       ) {
         console.log('responding to that.');
      this.threads.unshift(thread);
      this.ds.threads = this.threads;
      this.ds.updatehighestID();
      }
    });

    // here we have gotten a broadcast message from the API that one of our threads has changed.
    // (which means someone posted a reply) -- so we need to update our threads array with the
    // new one.
    this.ds.threadUpdated.subscribe( thread => {
      const objIndex = this.threads.findIndex((obj => obj.id === thread.id));
      this.threads[objIndex] = thread;
      this.ds.threads = this.threads;
    });

    this.ds.threadDeleted.subscribe( thread => {
      // console.log('thread deleted: ' + JSON.stringify(thread) );

      for (let i = 0; i < this.threads.length; i++) {
        if (this.threads[i].id === thread.id) {
          this.threads.splice(i, 1);
        }
      }

   });

    this.ds.enterDiscussion(this.currentUser, this.thisClass, this.discussionSettings.section).subscribe(
      Entry =>  { this.entry = Entry;
       },
      error => {this.errorMessage = <any> error;
        if (error.status === 200) {
          console.log('Got BOGUS Error message.');
        } else {
      console.log('Error: ' + JSON.stringify( error)); }
      });

  }

  checkSequenceAndFolds() {
    // Let's compare the order of the threads against their timestamps to
    // make sure they are in reverse chronological order
    for (let i = 0; i < this.threads.length - 1; i++) {
      const timeStampA = this.threads[i].post_date;
      const timeStampB = this.threads[i + 1].post_date;
      if (timeStampA < timeStampB) {
        // Houston, we have a problem.  These two elements are out of order.
        console.log('Houston, we have a problem.  These two elements are out of order.');
      }
    }

    if (!this.folds) {
      this.folds = [];
    }
    while (this.folds.length < this.threads.length)  {
      // Make sure the folds array is as big as the threads array
      this.folds.push(false);
    }
    this.ready2display = true;
  }


  reDisplay() {
   // console.log('Got emitted message.');

    this.ds.getThreads( this.thisClass.id, this.discussionSettings.section ).subscribe(
      threads => {
        this.newThreads = threads;
     //   console.log('Existing Threads: ');
      //  console.log( JSON.stringify( this.threads ));
      //  console.log('New Threads: ');
     //   console.log( JSON.stringify(this.newThreads));
      },
      error => {this.errorMessage = <any>error; },
      () => { console.log('FINISHED'); });



  }

  backToClass() {
    this.router.navigate(['/classes']);
  }
  ngOnChanges() {

    this.ds.getThreads( this.thisClass.id, this.discussionSettings.section ).subscribe(
      threads => this.threads = threads,
      error => this.errorMessage = <any>error);
  }
  ngDoCheck() {
    // console.log('Do checking!');
  }


  newThread(): void {

    // console.log('About to create new Thread.');

    if (this.discussionFormGroup.valid && this.discussionFormGroup.dirty) {

    //  console.log('Form was valid and dirty.');
    const combinedObject = Object.assign( {}, this.thread, this.discussionFormGroup.value);
    combinedObject.class_id = this.thisClass.id;
    combinedObject.user_id = this.currentUser.id;
    combinedObject.post_date = new Date( Date.now());
    combinedObject.section = this.discussionSettings.section;
    combinedObject.id = 0;

    this.threads.unshift(combinedObject);

    // console.log('About to post: ' + JSON.stringify( combinedObject ) );


    // This client just created a new thread:
    this.discussionFormGroup.reset();
    this.ds.newThread( combinedObject ).subscribe(
      data => {},
      err => {},
      () => {}
    );

    }


  }

  deleteReply (thread: Thread) {
  //  console.log('DELETING REPLY');
    let foundIndex = 0;
    for (let i = 0; i < this.threads.length; i++) {
      if (this.threads[i].id === thread.id) {
        foundIndex = i;
    //    console.log('found index');
        this.threads[i] = thread;
        this.ds.threads = this.threads;
        this.ds.updateThread(thread).subscribe(
          data => {},
          err => {
            console.log('error');
        },
        () => {
        //  console.log('Done saving deletion of reply');
        }
        );
        this.ds.threadUpdated.emit( thread);
        break;
      }
    }
  }

  // foldCollapse( thisThread: Thread) {
  //   // find the index of this thread so that we can
  //   // update the folds array with the same index
  //   // Note the folds array is a record of collapsed states of the threads
  //   // in this section, relative to the current user
  //   const index = this.threads.findIndex( obj =>  obj.id === thisThread.id  );
  //   this.folds[index] = true;
  // }
  // foldExpand( thisThread: Thread) {
  //   const index = this.threads.findIndex( obj =>  obj.id === thisThread.id  );
  //   this.folds[index] = false;
  // }

  foldChange( thisThread: Thread ) {
    const index = this.threads.findIndex( obj =>  obj.id === thisThread.id  );
    this.folds[index] = !this.folds[index] ;  // toggle it
    this.discussionSettings.folds = this.folds;
    this.ds.storeDiscussionSettings( this.discussionSettings ).subscribe(
      data => {},
      err => {},
      () => {
     //   console.log('stored fold change');
      }
    );

  }

  threadChange( thisThread: Thread ) {
    console.log('got the emission');
    const combinedObject = thisThread;
    combinedObject.class_id = this.class_id;
    combinedObject.user_id = this.currentUser.id;

    this.ds.getThreads( this.thisClass.id, this.discussionSettings.section ).subscribe(
              threads => { this.threads = threads;
               // console.log('Got new set of threads.');
               },
              error => this.errorMessage = <any>error);

  }
 deleteThread ( thisThread: Thread) {
   const conf = confirm('Are you sure you want to delete this discussion topic, and all of it\'s replies?');
   if (conf) {
  this.ds.deleteThread( thisThread ).subscribe(
    (val) => {
     // console.log('thread being deleted.');
     }, response => {
      // console.log('thread deletion.');
    this.removeThread(thisThread);

  }
    ,
      () => {
        // console.log('thread deletion finished'); this.removeThread(thisThread); 
      });
  }
 }

  removeThread( thisThread: Thread ) {
    let foundIndex = 0;
  //  console.log( JSON.stringify(thisThread));
    for (let i = 0; i < this.threads.length; i++) {
      if (this.threads[i].id === thisThread.id) {
        foundIndex = i;
   //     console.log('found index');
      }
    }
    if (foundIndex > -1) {
      this.threads.splice(foundIndex, 1);
      const dummyThread = <Thread>{};
      this.threads.push(dummyThread);
      this.threads.pop();
   //   console.log('removed the thread');
  }
  }
}
