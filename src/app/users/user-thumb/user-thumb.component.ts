import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Userthumbnail } from '../../models/userthumbnail.model';
import { Globals } from '../../globals';

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

  avatarImageURL: string;

  constructor ( private userService: UserService, private globals: Globals) { }

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

      this.avatarImageURL = this.globals.avatars + '/' +
        this.thumbnail.user_id + '/' + this.thumbnail.user.avatar_filename;
    if (this.thumbnail.user && this.thumbnail.user.avatar_filename === '' ) {
        this.thumbnail.user.avatar_URL = this.globals.avatars + '/placeholder.png';
        this.avatarImageURL = this.thumbnail.user.avatar_URL;
    }
    if (this.thumbnail.user.avatar_filename === undefined) {
      this.thumbnail.user.avatar_URL = this.globals.avatars + '/placeholder.png';
        this.avatarImageURL = this.thumbnail.user.avatar_URL;
    }
  }

}

