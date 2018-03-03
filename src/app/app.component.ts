import { Component, Output, OnInit, Input } from '@angular/core';
import {Http} from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { User } from './models/user.model';
import { UserService } from './services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {


  users: User[];
  errorMessage: string;
  dataConnection: boolean;

  constructor( private userService: UserService ) {

  }
  ngOnInit() {
      this.errorMessage = null;
      this.dataConnection = false;

      this.userService
      .getUsers().subscribe(
        users =>  {
          if (typeof users === 'string') {
            // If this is the case, then we ACTUALLY got an error.
            console.log(users);
            this.dataConnection = false;
          } else {
          this.users = users; if (this.users && this.users.length > 1) { this.dataConnection = true; }
      console.log('What I got back from the User Service: ' + JSON.stringify(this.users));
          }
      },
        error => { this.errorMessage = <any>error; this.dataConnection = false; });
  }

}

