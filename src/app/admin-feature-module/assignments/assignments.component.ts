// import { Component, OnInit, SecurityContext } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
// import { Globals } from '../../globals';
// import { Enrollment } from '../../models/enrollment.model';
// import { ClassModel } from '../../models/class.model';
// import { User } from '../../models/user.model';
// import { UserService } from '../../services/user.service';
// import { ClassService } from '../../services/class.service';
// import { AssignmentsService } from '../../services/assignments.service';


// @Component({
//     moduleId: module.id,
//     templateUrl: 'assignments.component.html',
//     styleUrls: ['assignments.component.css']
// })

// export class AssignmentsComponent implements OnInit {

//     form: FormGroup;


//     constructor(private router: Router, private activated_route: ActivatedRoute, private fb: FormBuilder,
//         private globals: Globals, private userService: UserService, private assignmentsService: AssignmentsService,
//     private classService: ClassService ) { }


//     ngOnInit() {


//         this.form = this.fb.group({
//             user_id: [ '', Validators.required ],
//             class_id: [ '', Validators.required ],
//             });

//     }
// }
