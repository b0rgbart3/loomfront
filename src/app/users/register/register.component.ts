import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { FormPoster } from '../../services/form-poster.service';
import { NgForm } from '@angular/forms';

import { UserService } from '../user.service';

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent {

    startDate = new Date();

    model = new User('', '', '', '');
    hasPrimaryLanguageError = false;
    date2 = new Date();

    constructor(private contactService: UserService) { }

    register() {

        console.log();

        // this.loading = true;
        // this.userService.create(this.model)
        //     .subscribe(
        //         data => {
        //             this.alertService.success('Registration successful', true);
        //             this.router.navigate(['/login']);
        //         },
        //         error => {
        //             this.alertService.error(error);
        //             this.loading = false;
        //         });
    }
}
