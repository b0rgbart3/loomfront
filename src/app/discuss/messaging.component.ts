import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ClassService } from '../services/class.service';
import { ClassModel } from '../models/class.model';
import { User } from '../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Section } from '../models/section.model';


@Component({
  selector: 'messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css'],
})

export class MessagingComponent implements OnInit {

  // local vars


  @Input() thisClass: ClassModel;
  @Input() students: User[];
  @Input() instructors: User[];


  constructor(

 ) {}

  ngOnInit() {

  }
}
