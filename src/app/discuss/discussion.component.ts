import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ClassService } from '../services/class.service';
import { ClassModel } from '../models/class.model';
import { User } from '../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Thread } from '../models/thread.model';
import { DiscussionService } from '../services/discussion.service';
import { Section } from '../models/section.model';
// import { ChatService } from '../chat/chat.service';
import { LoomNotificationsService } from '../services/loom.notifications.service';
import { LoomNotification } from '../models/loom.notification.model';
import { DiscussionSettings } from '../models/discussionsettings.model';


@Component({
  selector: 'discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css'],
  providers: [ClassService]
})

export class DiscussionComponent implements OnInit, OnChanges {

  // local vars
  discussing: boolean;
  folds: boolean[];
  thread: Thread;
  entry: boolean;
  ready2display: boolean;

  // form model
  discussionFormGroup: FormGroup;

  // local copies of service data
  classes: ClassModel[];
  selectedClass: {};
  errorMessage: string;
  currentUser: User;
  admin: boolean;
  users: User[];
  threads: Thread[];
  newThreads: Thread[];
  whosIn: any[];

  @Input() thisClass: ClassModel;
  @Input() section: Section;
  @Input() students: User[];
  @Input() instructors: User[];
  @Input() settings: DiscussionSettings;

  constructor(
    private router: Router,
    private activated_route: ActivatedRoute,
    private classService: ClassService,
    private userService: UserService,
    private fb: FormBuilder,
    private ds: DiscussionService,
    private notes: LoomNotificationsService,
 ) {}

  ngOnInit() {
   // console.log('In discussion component: settings: ' +
   //   JSON.stringify( this.settings ));

    this.ready2display = false;
    this.discussing = false;
    this.currentUser = this.userService.getCurrentUser();
    this.discussionFormGroup = this.fb.group( { 'subject': ['', [Validators.required ] ] } );



    if (this.settings) {
     //  console.log('I have a settings object.');

      if (!this.settings.folds) {
       // console.log('creating folds array.');
        this.settings.folds = []; }
    this.ds.getThreads( this.thisClass.id, this.settings.section ).subscribe(
      data => { this.threads = data;
        this.checkSequenceAndFolds();
      },
      error => this.errorMessage = <any>error);
    }
    // Here we are 'subscribing' to the event notifications that are being broadcast from the API
    // Perhaps these subscriptions should be in the ds service instead
    // of putting them here?

    this.ds.userEntered.subscribe( data => {
      // console.log('User entered: ' + JSON.stringify(data) );
      if (data.classID === this.thisClass.id) {
      //  console.log('class IDs match');
      }
      if (+data.sectionNumber === +this.settings.section) {
       // console.log('sectionNumbers match');
      } else {
        // console.log('Data.sectionNumber: ' + data.sectionNumber);
        // console.log('this.settings.section: ' + this.settings.section);
      }
      if ( (data.classID === this.thisClass.id) && (+data.sectionNumber === +this.settings.section)  ) {
        // console.log('About to send notice.');
        this.ds.sendNotice( {type: 'info', message:
        [ data.user.username + ' has entered the discussion.' ], delay: 2000} );
      }
    });

    this.ds.threadAdded.subscribe( thread => {
      // console.log('thread added: ' + JSON.stringify(thread) );
      // console.log('thread.section =' + thread.section);
      // console.log('this.section =' + JSON.stringify( this.section) );
      if ((this.thisClass.id === thread.class_id) && (+thread.section === +this.section.sectionNumber)
       ) {
     //    console.log('responding to that.');
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

    // this.ds.enterDiscussion(this.currentUser, this.thisClass, this.section.sectionNumber).subscribe(
    //   Entry =>  { this.entry = Entry;
    //    },
    //   error => {this.errorMessage = <any> error;
    //     if (error.status === 200) {
    //       console.log('Got BOGUS Error message.');
    //     } else {
    //   console.log('Error: ' + JSON.stringify( error)); }
    //   });

  }



 openDiscussion() {
   this.settings.discussing = true;
   this.saveDiscussionSettings();
   this.ds.introduceMyself( this.userService.currentUser, this.thisClass.id, this.section.sectionNumber);

}

closeDiscussion() {
     this.settings.discussing = false;
     this.saveDiscussionSettings();

 }

 saveDiscussionSettings() {
       console.log('In saveDS: ' + JSON.stringify(this.settings));
       this.ds.storeDiscussionSettings(this.settings).subscribe(
       data => console.log('done storing discussion settings.'), error => {
           console.log('ERROR trying to store the settings!');
           console.log(error); } );

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

    if (!this.settings.folds) {
      this.settings.folds = [];
    }
    while (this.settings.folds.length < this.threads.length)  {
      // Make sure the folds array is as big as the threads array
      this.settings.folds.push(false);
    }
    this.ready2display = true;
  }


  reDisplay() {
   // console.log('Got emitted message.');

    this.ds.getThreads( this.thisClass.id, this.settings.section ).subscribe(
      threads => {
        this.newThreads = threads;

      },
      error => {this.errorMessage = <any>error; },
      () => {
        // console.log('FINISHED');
      });



  }

  backToClass() {
    this.router.navigate(['/classes']);
  }
  ngOnChanges() {

    if (this.settings) {
    this.ds.getThreads( this.thisClass.id, this.settings.section ).subscribe(
      threads => this.threads = threads,
      error => this.errorMessage = <any>error);
    }
  }


  newThread(): void {

    // console.log('About to create new Thread.');

    if (this.discussionFormGroup.valid && this.discussionFormGroup.dirty) {

    //  console.log('Form was valid and dirty.');
    const combinedObject = Object.assign( {}, this.thread, this.discussionFormGroup.value);
    combinedObject.class_id = this.thisClass.id;
    combinedObject.user_id = this.currentUser.id;
    combinedObject.post_date = new Date( Date.now());
    combinedObject.section = this.settings.section + '';
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


  foldChange( thisThread: Thread ) {
  //  console.log('Got a fold change event in the discussion component.');
  //  console.log('thisThread.id: ' + thisThread.id);

    const index = this.threads.findIndex( obj =>  obj.id === thisThread.id  );
  //  console.log('found index: ' + index);
  //  console.log('this.folds' + JSON.stringify(this.settings.folds));

    this.settings.folds[index] = !this.settings.folds[index] ;  // toggle it
    // this.settings.folds = this.folds;
    this.ds.storeDiscussionSettings( this.settings ).subscribe(
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
    combinedObject.class_id = this.thisClass.id;
    combinedObject.user_id = this.currentUser.id;

    this.ds.getThreads( this.thisClass.id, this.settings.section ).subscribe(
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
