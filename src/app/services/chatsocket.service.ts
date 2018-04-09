import { Injectable, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Message } from '../models/message.model';

import { Globals } from '../globals2';
import { LoomNotificationsService } from './loom.notifications.service';
@Injectable()
export class ChatSocketService implements OnInit {
  private socket: SocketIOClient.Socket; // The client instance of socket.io

  constructor(private _notes: LoomNotificationsService, private globals: Globals ) {
    // this.socket = io(globals.chat_server);
    // this.socket.connect('http://localhost:3101');

    // we connected with the chatserver
    // this.socket.on('chatsocketconnect', (data) => {
    //   console.log(data.hello); // this worked!!!
    //   // this.sendNotice();
    //  // this.sendSocketNotice(data);
    // });

    // // respond to broadcast messages from the chatserver
    // this.socket.on('message', (data) => {
    //   console.log(data);
    //   this.sendSocketNotice(data);
    // });
  }

  ngOnInit() {

  }
  // sendNotice() {
  //   this._notes.add(<Notification> {type: 'success', message: 'New Client joined the Chat!'});
  // }
  // sendSocketNotice(data) {
  //   this._notes.add(<Notification> {type: 'info', message: data});
  // }

  // introduceMyself(user, classID) {
  //   this.sendSocketNotice('Welcome to the chatroom, ' + user.username);
  //   this.socket.emit('enter', user, classID);
  // }
  // Emit: message saved event
  // emitEventOnMessageSaved(messageSaved) {
  //     this.socket.emit('messageSaved', messageSaved);
  // }

  // // Emit: message updated event
  // emitEventOnMessageUpdated(messageUpdated) {
  //   this.socket.emit('MessageUpdated', messageUpdated);
  // }

  // // Consume: on message saved
  // consumeEventOnGistSaved() {
  //   const self = this;
  //   this.socket.on('messageSaved', function(message: Message){
  //     // self.toasterService.pop('success', 'NEW MESSAGE SAVED',
  //     //     'A message with title \"' + message.message );
  //   });
  // }

  // // Consume on message updated
  // consumeEventOnMessageUpdated() {
  //   const self = this;
  //   this.socket.on('messageUpdated', function(message: Message){
  //     // self.toasterService.pop('info', 'MESSAGE UPDATED',
  //     //     'A message with title \"' + message.message + '\" has just been updated');
  //   });
  // }
}
