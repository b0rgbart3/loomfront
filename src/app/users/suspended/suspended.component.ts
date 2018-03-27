import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { UserService } from '../../services/user.service';
import { ClassService } from '../../services/class.service';


@Component({
    templateUrl: 'suspended.component.html',
    styleUrls: ['suspended.component.css']
})

export class SuspendedComponent implements OnInit {
    username;

    instructorsByClass: any[];

    constructor( private router: Router,
    private userService: UserService, private classService: ClassService,
    private activated_route: ActivatedRoute ) {

        }

        login() {
           this.router.navigate(['/login']);
        }

        ngOnInit() {
        }
    }
