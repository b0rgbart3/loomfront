import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, animate, transition
} from '@angular/animations';
import { ClassService } from '../services/class.service';
import { ClassModel } from '../models/class.model';
import { User } from '../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { ChatSocketService } from '../services/chatsocket.service';


@Component({
  selector: 'infobot',
  templateUrl: './infobot.component.html',
  styleUrls: ['./infobot.component.css'],
  animations: [
    trigger('heroState', [
      state('inactive', style({
        backgroundColor: '#eee',
        transform: 'scale(1)'
      })),
      state('active',   style({
        backgroundColor: '#cfd8dc',
        transform: 'scale(1.1)'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ]
})

export class InfobotComponent implements OnInit {
public name: string;
public state= 'inactive';

@Input() msg: string;

  constructor() {
 }

  ngOnInit() {
    this.state = 'active';
      }

  toggleState() {

        this.state = this.state === 'active' ? 'inactive' : 'active';
        console.log(this.state);
      }
}
