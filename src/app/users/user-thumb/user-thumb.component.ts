import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Userthumbnail } from '../../models/userthumbnail.model';
import { Globals } from '../../globals2';

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
  shapeClass: string;
  borderStyle: string;

  avatarImageURL: string;

  constructor ( private userService: UserService, private globals: Globals) { }

  ngOnInit() {

    if (this.thumbnail) {
      if (!this.thumbnail.user) {

      this.userService.getUser(this.thumbnail.user_id).subscribe(
          user =>  {this.thumbnail.user = user[0];
          },
          error => this.errorMessage = <any>error);
        }

        this.avatarImageURL = this.globals.avatars + '/' +
          this.thumbnail.user_id + '/' + this.thumbnail.user.avatar_filename;

      if (this.thumbnail.user && this.thumbnail.user.facebookRegistration) {
        console.log('fb user: ' + JSON.stringify( this.thumbnail.user ) );
        // this.thumbnail.user.avatar_URL = this.thumbnail.user.avatar_URL;
        this.avatarImageURL = this.thumbnail.user.avatar_URL;
      }  else {
      if (this.thumbnail.user && this.thumbnail.user.avatar_filename === '' ) {
          this.thumbnail.user.avatar_URL = this.globals.avatars + '/placeholder.png';
          this.avatarImageURL = this.thumbnail.user.avatar_URL;
      }
      if (this.thumbnail.user.avatar_filename === undefined) {
        this.thumbnail.user.avatar_URL = this.globals.avatars + '/placeholder.png';
          this.avatarImageURL = this.thumbnail.user.avatar_URL;
      }
    }

      this.borderStyle = '';
      if (this.thumbnail.border) {
        this.borderStyle = ' noGlow';
      }
      this.shapeClass = this.thumbnail.shape + this.borderStyle;

    }
  }
}

