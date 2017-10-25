import { Component, OnInit, Input } from '@angular/core';
import { ClassService } from '../classes/class.service';
import { ClassModel } from '../models/class.model';
import { User } from '../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../users/user.service';


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

  @Input() class: ClassModel;
  @Input() instructors: User[];
  @Input() students: User[];

  constructor( private activated_route: ActivatedRoute,
    private classService: ClassService,
    private userService: UserService ) {}

  ngOnInit() {
    this.classID = this.activated_route.snapshot.params['id'];
    this.thisClass = this.activated_route.snapshot.data['thisClass'][0];
    this.users = this.activated_route.snapshot.data['users'];
  }
}
