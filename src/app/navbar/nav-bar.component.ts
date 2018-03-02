import {
  Component, OnInit, Input, Output, DoCheck
} from '@angular/core';
import { User } from '../models/user.model';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer } from '@angular/platform-browser';
import { FacebookService } from 'ngx-facebook/dist/esm/providers/facebook';
import { Globals } from '../globals';
import { ClickOutsideDirective } from '../_directives/clickOutside.directive';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import * as io from 'socket.io-client';
import { MessageService } from '../services/message.service';
import { Observable } from 'rxjs/Observable';
import { Message } from '../models/message.model';
import { Userthumbnail } from '../models/userthumbnail.model';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  providers: [  ]
})

export class NavBarComponent implements OnInit, DoCheck {

  errorMessage: string;
  username = '';
  avatarimage = '';
  currentUser: User;
  messages: Message[];  // all messages for current user
  admin;
  buttonStyle: string;
  freshMessages: Message[];
  showingMessageList: boolean;
  messageListStyle: string;
  freshList: {}[];
  private socket: SocketIOClient.Socket;

  constructor (
    private _flashMessagesService: FlashMessagesService,
    private _router: Router,
    public userService: UserService,
    private sanitizer: DomSanitizer,
    private FB: FacebookService,
    private globals: Globals,
    private messageService: MessageService
  ) {
  }

  updateMyself() {
    this.admin = false;
    this.currentUser = this.userService.currentUser;
    // console.log('In navbar: ' + JSON.stringify(this.currentUser));
    if (this.currentUser) {
      this.username = this.currentUser.username;
     // console.log('username: ' + this.username);
    }
    if (this.currentUser && this.currentUser.admin) {
      this.admin = true;
    } else {
      this.admin = false;
    }

  }

  logout() {
    this.username = null;
    this.avatarimage = '';
    this.userService.logout();
    localStorage.removeItem('username');
    this._router.navigate(['/welcome']);
    this.FB.logout();
  }


  ngOnInit() {
    this.updateMyself();
    this.username = localStorage.getItem('username');
    this.updateAvatar();
    this.showingMessageList = false;
    this.messageListStyle = 'quickMessagesButton';
    this.socket = io(this.globals.basepath);

    // this.socket.on('msgRplyAdded', (data) => {
    //   this.msgRplyAdded.emit(data);
    // });
    // this.getMessages();
    if (this.userService.currentUser) {
      this.checkFresh();
    }

    this.socket.on('messageChanged', (message) => {

      console.log('NavBar noticed a message was sent.');
      // this.msgChanged.emit(message);

      this.checkFresh();

  });
  }

  checkFresh() {
    this.messageService.getMessagesForUser(this.userService.currentUser).
     subscribe(
      data => { this.messages = data; },
      error => { console.log('error getting messages.'); }
     );
    this.messageService.getFreshList( this.userService.currentUser.id ).
      subscribe(
        data => { console.log('got fresh list: ' + JSON.stringify(data));
        this.freshMessages = data;
        if (this.freshMessages && this.freshMessages.length > 0) {
        this.buildFreshMessageList();
        this.messageListStyle = 'quickMessagesButtonFresh';
        } else {
          this.freshList = null;
          this.messageListStyle = 'quickMessagesButton';
        }
      },
        error => { console.log('error getting fresh list.'); }
      );
  }

  openMsg(msg) {
    console.log('Trying to open message for: ' + JSON.stringify(msg));
    this.messageService.sendMessage( msg );
  }

  buildMsgLine(msg) {
    // copy the users array
    const userArray = msg.users;
    const originalMsg = new Message(msg.id, msg.users, msg.freshness, msg.msgList);

    // find the current user's id in that array
    const index = userArray.indexOf(this.userService.currentUser.id);

    // remove it so that we're left with the OTHER user's id
    if (index > -1) {
      userArray.splice(index, 1);
    }

    // there should be only one id left in the array
    const otherUser_id = userArray[0];

    // let's build a thumbnail based on this user's id:

    const otherUser = this.userService.getUserFromMemoryById(otherUser_id);

    // add the current user back into the array (because we need both for messaging to work)
    userArray.push(this.userService.currentUser.id);
    // not sure about all these thumbnail parameters -- certainly don't use most of them, most of the time.
    const thumbnailObj = <Userthumbnail> { user: otherUser, user_id: otherUser.id, editable: false, inRoom: true,
          size: 40,  showUsername: true, showInfo: false, textColor: 'rgba(0,0,0,0)', hot: false };

    console.log('Building MSGLine: ' + JSON.stringify(msg));

    return { 'thumbnail' : thumbnailObj, 'msg': originalMsg, 'last_message' : msg.msgList[ msg.msgList.length - 1].message };
  }

  buildFreshMessageList() {

    if (this.freshMessages) {

       this.freshList = this.freshMessages.map( msg => this.buildMsgLine(msg) );
    }
  }

  openMessageList() {
    if (this.showingMessageList) { this.closeMessageList();
    } else {
    this.showingMessageList = true;
    console.log('opening');
    this.messageListStyle = 'quickMessagesButton_hi';
  }
  }

  closeMessageList() {
    if (this.showingMessageList) {
    this.showingMessageList = false;
    console.log('closing');

      this.messageListStyle = 'quickMessagesButton';



    }
  }

  updateAvatar() {
    if (this.currentUser) {
      if (this.currentUser.facebookRegistration) {
       // console.log('This was a fb reg.');
        this.avatarimage = this.currentUser.avatar_URL;
       // console.log('The avatar url is: ' + this.avatarimage);

      } else {
       // console.log('This was not a fb reg.');
       if (this.currentUser.avatar_filename) {
        this.avatarimage = this.globals.avatars + '/' + this.currentUser.id + '/' + this.currentUser.avatar_filename; } else {
        this.avatarimage = this.globals.avatars + '/placeholder.png';
        }
      }
    }
  }

  gotoSettings() {
    const navigationString = '/usersettings/' + this.userService.currentUser.id + '/edit';
    this._router.navigate([navigationString]);
  }

 ngDoCheck() {
  this.username = localStorage.getItem('username');
  if (!this.username || this.username === '') {
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser) {
      this.username = this.currentUser.username;
    }
  }
  this.updateAvatar();
 }

}
