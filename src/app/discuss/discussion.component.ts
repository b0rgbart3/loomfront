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
  newThreads: Thread[];
  entry: boolean;
  whosIn: any[];
  discussing: boolean;
  folds: boolean[];

  @Input() thisClass: ClassModel;
  @Input() students: User[];
  @Input() instructors: User[];
  @Input() section: Section;
  @Input() sectionNumber: number;

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
    this.discussing = false;
    // this.classID = this.activated_route.snapshot.params['id'];
    // this.thisClass = this.activated_route.snapshot.data['thisClass'][0];
    // this.users = this.activated_route.snapshot.data['users'];
  //  console.log('discussion initing: ' + this.thisClass.id + ', ' + this.sectionNumber);
    this.currentUser = this.userService.getCurrentUser();

    this.discussionFormGroup = this.fb.group( { 'subject': ['', [Validators.required ] ] } );

    this.ds.getThreads( this.thisClass.id, this.sectionNumber ).subscribe(
      threads => this.threads = threads,
      error => this.errorMessage = <any>error);

    this.ds.userEntered.subscribe( data => {
     //  console.log('User entered: ' + JSON.stringify(data) );

      if ( (data.classID === this.thisClass.id) && (data.sectionNumber === this.sectionNumber)  ) {
        this.sendNotice( {type: 'info', message:
        [ data.user.username + ' has entered the discussion.' ], delay: 2000} );
      }
    });

    // It seems like perhaps these subscriptions should be in the ds service instead
    // of putting them here?

    this.ds.threadAdded.subscribe( thread => { console.log('thread added: ' + JSON.stringify(thread) );

      this.threads.unshift(thread);
      this.ds.threads = this.threads;
      this.ds.updatehighestID();
    });

    // here we have gotten a broadcast message from the API that one of our threads has changed.
    // (which means someone posted a reply) -- so we need to update our threads array with the
    // new one.
    this.ds.threadUpdated.subscribe( thread => {
      console.log('GOING TO UPDATE MYSELF');
     console.log( JSON.stringify(thread));
      const objIndex = this.threads.findIndex((obj => obj.id === thread.id));
      console.log( 'Thread.id =' + thread.id + ', objIndex=' + objIndex);
      this.threads[objIndex] = thread;
      this.ds.threads = this.threads;
    });

    this.ds.threadDeleted.subscribe( thread => { console.log('thread deleted: ' + JSON.stringify(thread) );

      for (let i = 0; i < this.threads.length; i++) {
        if (this.threads[i].id === thread.id) {
          this.threads.splice(i, 1);
        }
      }

    //  console.log('Threads with thread removed: ' + JSON.stringify( this.threads));

   });

    // this.ds.getThreads( this.thisClass.id, this.sectionNumber ).subscribe(
    //   threads => {
    //     this.threads = threads;

    //   },
    //   error => {this.errorMessage = <any>error; },
    //   () => {  });




    // this.thread = { user_id: '1', classID: this.classID, id: 1, post_date: new Date( Date.now() ),
    //   subject: 'This is the first topic of conversation', replies: <any> [] } ;
    // this.threads = [];
    // this.threads.push(this.thread);

    // console.log(JSON.stringify( this.threads ));
    this.ds.enterDiscussion(this.currentUser, this.thisClass, this.sectionNumber).subscribe(
      Entry =>  { this.entry = Entry;
      //  console.log('Entered Discussion');
  //      this.ds.introduceMyself(this.currentUser, this.thisClass.id, this.sectionNumber );
       },
      error => {this.errorMessage = <any> error;
      console.log('Error: ' + this.errorMessage);
      },
      () => {
      //  console.log('finished entering the discussion.');
      });

      // this.ds.whosIn(this.thisClass, this.sectionNumber).subscribe(
      //   whosIn =>  {this.whosIn = whosIn.userIDs;
      //     console.log('Whos in: ' + JSON.stringify(this.whosIn) );
      //    // this.displayWhosIn();

      //    },
      //   error => this.errorMessage = <any>error);

      //  this._notes.add(new Notification('success', 'Welcome to the chatroom, ' + this.currentUser.username));

  }

  reDisplay() {
    console.log('Got emitted message.');

    this.ds.getThreads( this.thisClass.id, this.sectionNumber ).subscribe(
      threads => {
        this.newThreads = threads;
     //   console.log('Existing Threads: ');
      //  console.log( JSON.stringify( this.threads ));
      //  console.log('New Threads: ');
     //   console.log( JSON.stringify(this.newThreads));
      },
      error => {this.errorMessage = <any>error; },
      () => { console.log('FINISHED'); });


    // console.log('reloading discussion ' + this.thisClass.id + ', ' + this.sectionNumber);
    // this.ds.getThreads( this.thisClass.id, this.sectionNumber ).subscribe(
    //   threads => { this.threads = threads;
    //   console.log('Got new threads model: ' + JSON.stringify(this.threads)); },
    //   error => this.errorMessage = <any>error);
  }

  backToClass() {
    this.router.navigate(['/classes']);
  }
  ngOnChanges() {
  //  console.log('ch ch changin ' + this.thisClass.id + ', ' + this.sectionNumber);
    this.ds.getThreads( this.thisClass.id, this.sectionNumber ).subscribe(
      threads => this.threads = threads,
      error => this.errorMessage = <any>error);
  }
  ngDoCheck() {
    // console.log('Do checking!');
  }


  newThread(): void {

    // console.log('About to create new Thread.');

    if (this.discussionFormGroup.valid && this.discussionFormGroup.dirty) {

      console.log('Form was valid and dirty.');
    const combinedObject = Object.assign( {}, this.thread, this.discussionFormGroup.value);
    combinedObject.classID = this.thisClass.id;
    combinedObject.user_id = this.currentUser.id;
    combinedObject.post_date = new Date( Date.now());
    combinedObject.sectionNumber = this.sectionNumber;
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

    } else {  // console.log('Valid:' + this.discussionFormGroup.valid);
 //  console.log('Dirty:' + this.discussionFormGroup.dirty );
}

  // this.ds.getThreads( this.thisClass.id ).subscribe(
  //   threads => { this.threads = threads; console.log('Got new set of threads.');
  //   console.log('Threads after: ' + JSON.stringify(this.threads));
  // },
  //   error => this.errorMessage = <any>error);
  }

  deleteReply (thread: Thread) {
    console.log('DELETING REPLY');
    let foundIndex = 0;
    for (let i = 0; i < this.threads.length; i++) {
      if (this.threads[i].id === thread.id) {
        foundIndex = i;
        console.log('found index');
        this.threads[i] = thread;
        this.ds.threads = this.threads;
        this.ds.updateThread(thread).subscribe(
          data => {},
          err => {
            console.log('error');
        },
        () => {
          console.log('Done saving deletion of reply');
        }
        );
        this.ds.threadUpdated.emit( thread);
        break;
      }
    }
  }

  threadChange( thisThread: Thread ) {
    console.log('got the emission');
    const combinedObject = thisThread;
    combinedObject.classID = this.classID;
    combinedObject.user_id = this.currentUser.id;
    // console.log('About to post: ' + JSON.stringify( combinedObject ) );

    // this.ds.updateThread( combinedObject ).subscribe(
    //       (val) => { }, response => { console.log('thread saved'); }
    //       ,
    //         () => { console.log('finished'); });

    this.ds.getThreads( this.thisClass.id, this.sectionNumber ).subscribe(
              threads => { this.threads = threads;
               // console.log('Got new set of threads.');
               },
              error => this.errorMessage = <any>error);

  }
 deleteThread ( thisThread: Thread) {
   const conf = confirm('Are you sure you want to delete this discussion topic, and all of it\'s replies?');
   if (conf) {
  this.ds.deleteThread( thisThread ).subscribe(
    (val) => { console.log('thread being deleted.'); }, response => {
      // console.log('thread deletion.');
    this.removeThread(thisThread);

  }
    ,
      () => { console.log('thread deletion finished'); this.removeThread(thisThread); });
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
