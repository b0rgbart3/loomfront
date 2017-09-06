import { Component, OnInit } from '@angular/core';
import { User } from './user';


@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})

export class UsersComponent {

	currentUser = <User> { "username": "Bart" };

}