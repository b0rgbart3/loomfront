import { Component, OnInit, Input, OnChanges, AfterViewChecked, AfterViewInit, AfterContentInit } from '@angular/core';
// import { ClassService } from '../services/class.service';
// import { ClassModel } from '../models/class.model';
import { User } from '../models/user.model';
// import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Section } from '../models/section.model';
import { MessageService } from '../services/message.service';
import { Message } from '../models/message.model';
import { MessageReply } from '../models/messagereply.model';
import { scrollTo } from 'ng2-utils';
import { Userthumbnail } from '../models/userthumbnail.model';
// import { NumberOfBytesType } from 'aws-sdk/clients/kms';


@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})

export class MessageComponent implements OnInit {
  public _msgs: {};
  display: boolean;
  msgForm: FormGroup;
  currentMessage: Message;
  toUser: User;
  scrolled: boolean;
  user1: string;
  user2: string;
  thumbnail: Userthumbnail;
  currentUserID: string;
  currentUser: User;

  constructor( private _messages: MessageService,
    private userService: UserService, private fb: FormBuilder) {

     // this._messages.ngOnInit();
      this.scrolled = false;
    
      this.currentUser = userService.getCurrentUser();
      if (this.currentUser && this.currentUser.id) {
      this.currentUserID = this.currentUser.id;
      } else {
        this.currentUserID = "0";
      }


    this._msgs = new Array<{}>();
    _messages.msgAdded.subscribe( requested => {

      console.log('a new message was requested:' + JSON.stringify(requested));
      this.toUser = requested['user'];
      if (this.userService.currentUser) {
      this.user1 = this.userService.currentUser.id; }
      console.log('Requested: ' + JSON.stringify(requested['user']) );
      this.user2 = requested['user'].id;

      this.thumbnail = null;

      const users = [this.user1, this.user2];
      console.log('Users: ' + JSON.stringify(users));
      this._messages.getConversation( users ).subscribe(
        data => {
          if (data && data[0]) {

          this.currentMessage = data[0];
        //  scrollTo('#s3', '#v-scrollable');
           console.log('Message Object from the service: ' + JSON.stringify(data));

         // Because we are now *viewing* this message, it is no longer 'fresh', so mark it as such
         // and save the update object to Mongo
            this.currentMessage.freshness[0].fresh = false;
            this.currentMessage.freshness[1].fresh = false;
        //  this.scrollMe();
          } else {
            console.log('Got no data returned from service.');
            const freshArray = [{user_id: this.user1, fresh: false}, {user_id: this.user2, fresh: true }];
            this.currentMessage = new Message( _messages.gethighestID(), users, freshArray, [] );
            this.createMsg();
            console.log('Created new Message object: ' + JSON.stringify(this.currentMessage));
       //     this.scrollMe();
          }
          this.thumbnail = { user: this.toUser, user_id: this.toUser.id, online: false,
            size: 50,  showUsername: false, showInfo: false, textColor: '#000000', border: true, shape: 'circle' };

        },
        error => console.log('error getting message from the api')
      );

     // this._msgs = data;
      this.display = true;

      this.scrollMe();

    });
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
     this.sendMsg();
    }
  }


  ngOnInit() {
    this.display = false;
    this.scrolled = false;
    this.msgForm = this.fb.group( { msg: ''  });

    // this._messages.msgRplyAdded.subscribe( data => {

    //   console.log('A new Message reply was added - so do something with it!');
    // });

    // this._messages.userEntered.subscribe( data => {
    //    console.log('User entered: ' + JSON.stringify(data) );
    // });
      this._messages.msgChanged.subscribe( message => {
         // if this message broadcast is an update to the model I'm displaying,
         // then let's update it -- otherwise ignore it.  This is because I don't want to update the
         // display for the current viewer (user) -- if two other people are chatting in a separate thread
         if (this.display) {
         if (message.id === this.currentMessage.id ) {
           this.currentMessage = message;
         }}
      });

     // console.log('In init method!!!');

  }

  scrollMe() {

   // scrollTo('#s3', '#v-scrollable');
    this.scrolled = true;
  }

  closeMsgr() {
  //  console.log('closing the messenger');
    this.display = false;
    if (this.currentMessage) {
      this._messages.makeStale(this.currentMessage).subscribe(
        message => message, error => console.log(error)
      ); }
  }

  // here we want to 'create' the message in Mongo as a stored object
  // but since there's not actual message yet, we don't want to broadcast anything about it
  createMsg() {
    this._messages.createMessage(this.currentMessage).subscribe(
      (data) => {
        console.log('Created a new message, back from the service: ' + JSON.stringify(data));
        this.currentMessage = data;
        },
        response => {
        },
        () => {
          console.log('done creating message.');
        }
  );
  }
  sendMsg() {
    // only execut this chunk if the user actualy entered a new message,
    // but if not, then they merely viewed the message, in which case we want to go ahead
    // and save it as 'stale', without adding to the msgList

    if (this.msgForm.dirty) {
        const thisReply = new MessageReply( this.userService.currentUser.id, this.msgForm.value.msg );
        if (!this.currentMessage.msgList) {
          this.currentMessage.msgList = [];
        }
        this.currentMessage.msgList.push(thisReply);
        this.msgForm.reset();


        const freshArray = [{user_id: this.user1, fresh: false}, {user_id: this.user2, fresh: true }];
        this.currentMessage['freshness'] = freshArray;

    }
    // console.log('About to save Message Object: ' + JSON.stringify(this.currentMessage));
    // this._messages.msgRplyAdded.emit(thisReply);
    this._messages.saveMessage(this.currentMessage).subscribe(
      (val) => {

        },
        response => {
        },
        () => {
      //    console.log('done saving message.');
        }
  );
  }

}
