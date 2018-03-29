import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { Userthumbnail } from '../../../models/userthumbnail.model';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [UserService]
})

export class UserListComponent implements OnInit {

  order: string;
  reverse: boolean;
  // userForm: FormGroup;

  @Input() users: User[];
  @Input() showInstructorChoice: boolean;
  @Input() showSuspensionChoice: boolean;

  sortedUsers: User[];
  thumbnails: Userthumbnail[];
  sortedThumbnails: Userthumbnail[];
  sortParams: string[];

  constructor(private userService: UserService, private fb: FormBuilder ) { }

  ngOnInit() {
    this.order = 'username';
    this.reverse = false;

      this.thumbnails = this.users.map( user =>
      this.createThumbnail( user) );
    this.sortedThumbnails = this.thumbnails;

    this.sortParams = ['', 'username', 'firstname', 'lastname', 'email', 'created_date'];
    // this.userForm = this.fb.group({
    //   suspend: '',
    // });

 }

// let the user choose which parameter to sort the list by
// note the reverse order gets toggled - if the user clicks
// on the same parameter item again
 setOrder(value: string) {
  if (this.order === value) {
    this.reverse = !this.reverse;
  } else {
  this.order = value;
  this.reverse = true;
  }

/* OK so this line of code is VERY sophisticated and is
   doing a lot - so I feel the need to explain it while I
   still understand it.

   First, It's using a ternary operator to call one of two functions
   based on the boolean value of the reverse property.

   Then, it's passing a STRING to the sort function, to tell it
   which property on the user object (which is nested in the
   thumbnail object) of our array to sort by.

   Pretty fucking amazing!
*/

  this.reverse ? this.thumbnailSort(this.order) :
    this.thumbnailSortReverse(this.order);

}

 createThumbnail(user) {
  const thumbnailObj = { user: user, user_id: user.id, online: false,
      size: 50,  showUsername: false, showInfo: false, textColor: '#ffffff', border: false, shape: 'circle' };
  return thumbnailObj;
}

thumbnailSort(criteria: string) {
  console.log('sorting thumbnails with criteria of: ' + criteria);
    const copy = this.thumbnails;
    copy.sort( function(a, b) {
      const textA = a.user[criteria].toString().toLocaleLowerCase();
      const textB = b.user[criteria].toString().toLocaleLowerCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    this.sortedThumbnails = copy;
  }


  thumbnailSortReverse(criteria: string) {
    const copy = this.thumbnails;
    copy.sort( function(a, b) {
      console.log('User A: ' + a.user[criteria]);
      const textA = a.user[criteria].toString().toLocaleLowerCase();
      const textB = b.user[criteria].toString().toLocaleLowerCase();
      return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
    });
    this.sortedThumbnails = copy;
  }

  suspend(user) {
    if (!user.suspended) {
      console.log('suspending');
    this.userService.suspendUser(user); } else {
      console.log('unsuspending');
      this.userService.unsuspendUser(user);
    }
  }

  toggleInstructorStatus(user) {
   this.userService.toggleInstructorStatus(user);
  }

}
