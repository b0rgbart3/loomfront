import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';



@Component({
    templateUrl: 'welcome.component.html',
    styleUrls: ['welcome.component.css']
})

export class WelcomeComponent {


    constructor(    private authenticationService: AuthenticationService, private router: Router
  ) { }

        login() {
           this.router.navigate(['/login']);
        }

}