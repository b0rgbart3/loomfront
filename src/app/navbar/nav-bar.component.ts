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
  list: {}[];
  private socket: SocketIOClient.Socket;
  private showAvatarMenu: boolean;

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

  openAvatarMenu() {
    this.showAvatarMenu = true;
  }
  closeAvatarMenu() {
    this.showAvatarMenu = false;
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
    this.showAvatarMenu = false;
    this.username = null;
    this.avatarimage = '';
    this.userService.logout();
    // localStorage.removeItem('username');
    if (this.FB) {
    this.FB.logout(); }
    this._router.navigate(['/welcome']);
  }


  ngOnInit() {
    this.showAvatarMenu = false;
    this.updateMyself();
    // this.userService.getUsers();
    this.username = localStorage.getItem('username');
    this.updateAvatar();
    this.showingMessageList = false;
    this.messageListStyle = 'quickMessagesButton';
    this.socket = io(this.globals.basepath);

    this.currentUser = this.userService.currentUser;
    // this.userService.getCurrentUser().subscribe(
    //   data => this.currentUser = data,
    //   error => console.log('error getting user from service')
    // );

    // this.socket.on('msgRplyAdded', (data) => {
    //   this.msgRplyAdded.emit(data);
    // });
    // this.getMessages();
    if (this.userService.currentUser) {
      this.userService.getUsers();
      this.checkFresh();
    }
    this.socket.on('userSettingsChanged', (user) => {
      console.log('NavBar noticed the user settings changed.');
      // this.updateMyself();
      this.currentUser = user;
   });
    this.socket.on('userChanged', (user) => {
       console.log('NavBar noticed the user changed.');
       this.updateMyself();
    });

    this.socket.on('messageChanged', (message) => {

     console.log('NavBar noticed a message was sent.');
      // this.msgChanged.emit(message);

      this.checkFresh();

      });
  }

  checkFresh() {
    console.log('About to check messages for: ' +
     this.userService.currentUser.id);

    this.messageService.getMessagesForUser(this.userService.currentUser.id).
     subscribe(
      data => {
        // console.log('got messages for user: ' + JSON.stringify(data));
      this.messages = data;
      if (this.messages && this.messages.length > 0) {
        this.buildMessageList();
      }
    },
      error => { console.log('error getting messages.'); }
     );
    this.messageService.getFreshList( this.userService.currentUser.id ).
      subscribe(
        data => {
          // console.log('got fresh list: ' + JSON.stringify(data));
        this.freshMessages = data;
        if (this.freshMessages && this.freshMessages.length > 0) {
        this.buildFreshMessageList();
        this.messageListStyle = 'quickMessagesButtonFresh';
        } else {
          this.freshList = null;
         // this.messageListStyle = 'quickMessagesButton';
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
    console.log('About to build, based on: ' + JSON.stringify(msg));
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
    const thumbnailObj = <Userthumbnail> { user: otherUser, user_id: otherUser_id, online: false,
          size: 40,  showUsername: true, showInfo: false, textColor: 'rgba(0,0,0,0)', hot: false, shape: 'circle' };

    // console.log('Building MSGLine: ' + JSON.stringify(msg));

    return { 'thumbnail' : thumbnailObj, 'msg': originalMsg, 'last_message' : msg.msgList[ msg.msgList.length - 1].message };
  }

  buildMessageList() {
    if (this.userService.usersLoaded) {
    console.log('In build Message List: ' + JSON.stringify(this.messages));
    if (this.messages) {
      console.log('mapping');
      this.list = this.messages.map( msg => this.buildMsgLine(msg) );
    }
    }
  }
  buildFreshMessageList() {
    if (this.userService.usersLoaded) {
    console.log('About to build freshList, based on: ' + JSON.stringify( this.freshMessages ) );
    if (this.freshMessages) {

       this.freshList = this.freshMessages.map( msg => this.buildMsgLine(msg) );

       this.checkForDups();
      }
    }
  }

  checkForDups() {
    console.log('In checkForDups');
    if (this.freshList && this.freshList.length > 0) {
      // remove the items that are in both lists, from the main list

      this.freshList.map( msgItem => this.removeItemFromMainList(msgItem));
    }
  }

  removeItemFromMainList(msgItem) {
    console.log('checking for duplicity.');
    if ( this.list && this.list.length > 0) {
      console.log('about to loop.');
   for (let i = 0; i < this.list.length; i ++) {
     console.log(' In the Loop: ' + i + ', :' + JSON.stringify(this.list[i]['msg']) );

     if (this.list[i]['msg'].id === msgItem.msg.id) {
       this.list.splice(i, 1);
     }
   }}
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

    // this.messageListStyle = 'quickMessagesButton';
    if (this.freshMessages && this.freshMessages.length > 0) {
      // this.buildFreshMessageList();
      this.messageListStyle = 'quickMessagesButtonFresh';
      } else {
       // this.freshList = null;
        this.messageListStyle = 'quickMessagesButton';
      }


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
    this.showAvatarMenu = false;
    const navigationString = '/usersettings/' + this.userService.currentUser.id + '/edit';
    console.log('navigating to: ' + navigationString);
    this._router.navigate([navigationString]);
  }

 ngDoCheck() {
  this.username = localStorage.getItem('username');
  if (!this.username || this.username === '') {
    // this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser) {
      this.username = this.currentUser.username;
    }
  }
  this.updateAvatar();
 }

}
