import {Component} from '@angular/core';
import {Http} from '@angular/http';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  templateUrl: './student-homepage.component.html',
  styleUrls: ['./student-homepage.component.css']
})
export class StudentHomepageComponent {
  title = 'app';

  constructor (
    private authenticationService: AuthenticationService)
    {}

    
}