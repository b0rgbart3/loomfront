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
    @Input() editable: boolean;
    @Input() deletable: boolean;
  userCount: number;
  users: User[];
  filteredUsers: User[];
  selectedUser: User;

  ngOnInit() {
    if (this.user && this.user.avatar_URL === undefined) {
        this.user.avatar_URL = 'http://localhost:3100/avatars/placeholder.png';
    }
  }

}
