import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { ClassService } from '../classes/class.service';
import { ClassModel } from '../models/class.model';
import { User } from '../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { ChatService } from './chat.service';
import { Userthumbnail } from '../models/userthumbnail.model';
import { ChatSocketService } from '../services/chatsocket.service';
import { NotificationsService } from '../services/notifications.service';
import { Notification } from '../models/notifications.model';


@Component({
  selector: 'chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css'],
  providers: [ClassService]
})

export class ChatroomComponent implements OnInit {

  classes: ClassModel[];
  selectedClass: {};
  errorMessage: string;
  currentUser: User;
  admin: boolean;
  classID: string;
  thisClass: ClassModel;
  users: User[];
  chatEntry: boolean;
  whosIn: any[];
  inChatInstructors: Object[];
  instThumbObjects: Userthumbnail[];
  public studentThumbnails: Userthumbnail[];
  public msg: string;

  @Input() class: ClassModel;
  @Input() instructors: User[];
  @Input() students: User[];

  constructor( private activated_route: ActivatedRoute,
    private classService: ClassService,
    private userService: UserService,
    private chatService: ChatService,
  private chatSocketService: ChatSocketService,
private _notes: NotificationsService ) {
 }

  ngOnInit() {
    this.msg = 'test this';
    this.classID = this.activated_route.snapshot.params['id'];
    this.thisClass = this.activated_route.snapshot.data['thisClass'][0];
    this.users = this.activated_route.snapshot.data['users'];

    this.instructors = [];
    this.instructors = this.classService.getInstructors(this.thisClass, this.users);
    this.students = [];
    this.students = this.classService.getStudents(this.thisClass, this.users);
    this.studentThumbnails = this.students.map(this.createThumbnail);

    console.log('Student thumbnails' + JSON.stringify(this.studentThumbnails));

    this.currentUser = this.userService.getCurrentUser();

    this.chatService.enterChat(this.currentUser, this.thisClass).subscribe(
      chatEntry =>  {this.chatEntry = chatEntry;
       },
      error => this.errorMessage = <any>error);

    this.chatService.whosIn(this.thisClass).subscribe(
      whosIn =>  {this.whosIn = whosIn.userIDs;
        console.log('Whos in: ' + JSON.stringify(this.whosIn) );
        this.displayWhosIn();

       },
      error => this.errorMessage = <any>error);

    //  this._notes.add(new Notification('success', 'Welcome to the chatroom, ' + this.currentUser.username));
      this.chatSocketService.introduceMyself(this.currentUser, this.thisClass.id );
    }

    createThumbnail(user) {
      const thumbnailObj = { user: user, user_id: user.id, editable: false,
        inRoom: false, size: 90, showUsername: true, showInfo: false, textColor: '#000000' };
      return thumbnailObj;
    }

    displayWhosIn() {
      console.log('Looking for who is in...');
      this.inChatInstructors = [];
      this.instThumbObjects = [];
      if (this.whosIn && this.whosIn.length > 0) {
      for (let i = 0; i < this.instructors.length; i++) {
        let isIn = false;
        for (let j = 0; j < this.whosIn.length; j++) {
          if (this.whosIn[j] === this.instructors[i].id) {
            isIn = true;
          }
        }
        const instObj = { user: this.instructors[i], inRoom: isIn};
        this.inChatInstructors.push(instObj);
        const instThumbObj = <Userthumbnail> { user: this.instructors[i],
          user_id: this.instructors[i].id, inRoom: isIn, editable: false, size: 90, showUsername: true, showInfo: false};
        this.instThumbObjects.push(instThumbObj);
      }
    }

    }

}
