import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../models/user.model';
import { ClassModel } from '../models/class.model';
import { UserService } from '../services/user.service';
import { ClassService } from '../services/class.service';
import { Enrollment } from '../models/enrollment.model';

@Component({
    templateUrl: 'welcome.component.html',
    styleUrls: ['welcome.component.css']
})

export class WelcomeComponent implements OnInit {
    username;
    currentUser: User;
    classes: ClassModel[];
    errorMessage: string;
    instructorassignments: Enrollment[];

    constructor( private router: Router,
    private userService: UserService, private classService: ClassService,
    private activated_route: ActivatedRoute ) {

        }

        login() {
           this.router.navigate(['/login']);
        }

        ngOnInit() {
            this.instructorassignments = this.activated_route.snapshot.data['instructorassignments'];

            this.classes = this.activated_route.snapshot.data['classes'];

            this.currentUser = this.userService.getCurrentUser();
            

        }
}
