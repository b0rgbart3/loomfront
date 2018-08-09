import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { LoomNotification } from '../../models/loom.notification.model';
import { LoomNotificationsService } from '../../services/loom.notifications.service';

@Component({
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.css'],
})
export class ValidatorComponent implements OnInit {

  validationCode: string;
  validatedUser: User;
  errorMessage: string;

  constructor( private activated_route: ActivatedRoute, private userService: UserService,
    private router: Router, private _notes: LoomNotificationsService ) { }

  ngOnInit() {
    console.log('In validation component.');
    this.validationCode = this.activated_route.snapshot.params['vcode'];
    this.userService.validateUser(this.validationCode).subscribe(

      (validatedUser) => { this.validatedUser = <User> validatedUser[0];
        // this.validatedUser.verified = new Date().toLocaleString();
        const verificationDate = new Date().toLocaleString();
        if (this.validatedUser) {
              this.validatedUser.verified = verificationDate;

              console.log('verification date: ' + verificationDate);

              console.log('Verified user: ' + JSON.stringify(this.validatedUser));

              this.userService.updateUser(this.validatedUser).subscribe(
                (val) => {
                  console.log('updating user with verification code ', val);
                },
                response => {
                  console.log('update of user verification in error', response);
                },
                () => {
                  console.log('User verification now completed.');

                  if (this.validatedUser && this.validatedUser.verified !== 'false') {
                  this._notes.add(new LoomNotification('success', ['Thank you for verifying your account.'], 10000));
                  } else {

                  }
                  if (this.userService.isAdmin() ) {
                    this.router.navigate(['/admin']);
                  } else {

                    this.router.navigate(['/welcome']);
                    }
                  }
                );
        } else {
          this._notes.add(new LoomNotification('error', ['That validation code was not recognized.'], 10000));
          this.router.navigate(['/welcome']);
        }

             },
   (error) => { this.errorMessage = error; }
 );

  }

}
