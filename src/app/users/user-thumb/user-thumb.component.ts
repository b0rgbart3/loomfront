import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../user.service';
import { Userthumbnail } from '../../models/userthumbnail.model';

@Component({
  selector: 'user-thumb',
  templateUrl: './user-thumb.component.html',
  styleUrls: ['./user-thumb.component.css'],
})

export class UserThumbComponent implements OnInit {
    @Input() thumbnail: Userthumbnail;

  userCount: number;
  users: User[];
  filteredUsers: User[];
  selectedUser: User;
  errorMessage: string;
  inClass: string;

  constructor ( private userService: UserService) { }

  ngOnInit() {

    if (this.thumbnail.inRoom) {this.inClass = 'userThumb inDaHouse'; } else {
      this.inClass = 'userThumb notInDaHouse';
    }
    if (!this.thumbnail.user) {
      // console.log('loading in the user: ' + this.thumbnail.user_id);
     this.userService.getUser(this.thumbnail.user_id).subscribe(
        user =>  {this.thumbnail.user = user[0];
          // console.log('found user: ' + JSON.stringify(this.thumbnail.user));
        },
        error => this.errorMessage = <any>error);
      }
      // console.log( 'User: ' + JSON.stringify(this.user));
    if (this.thumbnail.user && this.thumbnail.user.avatar_URL === '' ) {
        this.thumbnail.user.avatar_URL = 'http://localhost:3100/avatars/placeholder.png';
    }
  }

}

