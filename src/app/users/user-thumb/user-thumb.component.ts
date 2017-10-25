import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'user-thumb',
  templateUrl: './user-thumb.component.html',
  styleUrls: ['./user-thumb.component.css'],
})

export class UserThumbComponent implements OnInit {
    @Input() user: User;
    @Input() user_id: number;
    @Input() editable: boolean;
    @Input() deletable: boolean;
    @Input() tiny: boolean;
  userCount: number;
  users: User[];
  filteredUsers: User[];
  selectedUser: User;
  errorMessage: string;

  constructor ( private userService: UserService) { }

  ngOnInit() {
    if (!this.user) {
     this.userService.getUser(this.user_id).subscribe(
        user =>  {this.user = user[0];
        },
        error => this.errorMessage = <any>error);
      }

    if ((this.user !== null) && this.user.avatar_URL === undefined) {
        this.user.avatar_URL = 'http://localhost:3100/avatars/placeholder.png';
    }
  }

}

