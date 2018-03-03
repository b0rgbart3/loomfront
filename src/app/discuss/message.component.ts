import { Component, OnInit, Input, OnChanges, AfterViewChecked, AfterViewInit, AfterContentInit } from '@angular/core';
import { ClassService } from '../services/class.service';
import { ClassModel } from '../models/class.model';
import { User } from '../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Section } from '../models/section.model';
import { MessageService } from '../services/message.service';
import { Message } from '../models/message.model';
import { MessageReply } from '../models/messagereply.model';
import { scrollTo } from 'ng2-utils';


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

  constructor( private _messages: MessageService,
    private userService: UserService, private fb: FormBuilder) {

      this._messages.ngOnInit();
      this.scrolled = false;
    this._msgs = new Array<{}>();
    _messages.msgAdded.subscribe( requested => {

      console.log('a new message was requested:' + JSON.stringify(requested));
      this.toUser = requested['user'];
      if (this.userService.currentUser) {
      this.user1 = this.userService.currentUser.id; }
      console.log('Requested: ' + JSON.stringify(requested['user']) );
      this.user2 = requested['user'].id;

      const users = [this.user1, this.user2];
      console.log('Users: ' + JSON.stringify(users));
      this._messages.getMessage( users ).subscribe(
        data => {
          if (data[0]) {
          this.currentMessage = data[0];
        //  scrollTo('#s3', '#v-scrollable');
          console.log('Message Object from the service: ' + JSON.stringify(this.currentMessage));
          this.scrollMe();
          } else {
            const freshArray = [{user_id: this.user1, fresh: false}, {user_id: this.user2, fresh: true }];
            this.currentMessage = new Message( _messages.highestID, users, freshArray, [] );
            console.log('Created new Message object: ' + JSON.stringify(this.currentMessage));
            this.scrollMe();
          }
        },
        error => console.log('error getting message from the api')
      );

     // this._msgs = data;
      this.display = true;

      this.scrollMe();

    });
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
         // then let's update it -- otherwise ignore it.
         if (this.display) {
         if (message.id === this.currentMessage.id ) {
           this.currentMessage = message;
         }}
      });

      console.log('In init method!!!');

  }

  scrollMe() {

    console.log('In the scrollMe method.');
    const targetEl = <HTMLElement>document.querySelector('#s3');
    if (targetEl) {
      console.log('found the target.');
    scrollTo('#s3', '#v-scrollable');
    this.scrolled = true; }
  }

  closeMsgr() {
    console.log('closing the messenger');
    this.display = false;
    if (this.currentMessage) {
      this._messages.makeStale(this.currentMessage).subscribe(
        message => message, error => console.log(error)
      ); }
  }

  sendMsg() {
    const thisReply = new MessageReply( this.userService.currentUser.id, this.msgForm.value.msg );
    if (!this.currentMessage.msgList) {
      this.currentMessage.msgList = [];
    }
    this.currentMessage.msgList.push(thisReply);
    this.msgForm.reset();

    const freshArray = [{user_id: this.user1, fresh: false}, {user_id: this.user2, fresh: true }];
    this.currentMessage['freshness'] = freshArray;

    console.log('About to save Message Object: ' + JSON.stringify(this.currentMessage));
    // this._messages.msgRplyAdded.emit(thisReply);
    this._messages.saveMessage(this.currentMessage).subscribe(
      (val) => {

        },
        response => {
        },
        () => {
          console.log('done saving message.');
        }
  );
  }

}
