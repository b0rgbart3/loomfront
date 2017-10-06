import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user.model';

@Component({
  templateUrl: './student-homepage.component.html',
  styleUrls: ['./student-homepage.component.css']
})
export class StudentHomepageComponent implements OnInit {
  title = 'app';
  currentUser: User;

  constructor (
    private authenticationService: AuthenticationService) { }

    ngOnInit() {
      this.currentUser = this.authenticationService.getCurrentUser();
      console.log( JSON.stringify (this.currentUser ));
      
    }

}
