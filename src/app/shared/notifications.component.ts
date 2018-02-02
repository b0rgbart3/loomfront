import { Component, OnInit, AnimationTransitionEvent } from '@angular/core';
import { trigger, state, style, animate, transition
} from '@angular/animations';
import { NotificationsService } from '../services/notifications.service';
import { Notification } from '../models/notifications.model';

@Component({
    selector: 'notifications',
    template: `
    <div class="notifications" *ngFor='let note of _notes'>
        <div (click)="hide(note)" class="{{ note.type }}" [@noteState]="state"
        (@noteState.done)='handleDone(note)'>
            <p *ngFor='let line of note.message'>{{ line }}</p>
        </div>
    </div>
    `,
    animations: [
        trigger('noteState', [
            state('first', style({
                transform: 'scale(1)',
                opacity: 1
            })),
          state('inactive', style({
            transform: 'scale(1)',
            opacity: 0
          })),
          state('active',   style({
            transform: 'scale(1.2)',
            opacity: 1
          })),
          transition('first => active', animate('300ms ease-out')),
          transition('inactive => active', animate('100ms ease-in')),
          transition('active => inactive', animate('300ms ease-out'))
        ])
      ]
})
export class NotificationsComponent implements OnInit {
    public _notes: Notification[];
    public state = 'first';
    constructor(private _notifications: NotificationsService) {
        this._notes = new Array<Notification>();
        _notifications.noteAdded.subscribe(note => {
            this._notes.push(note);
            this.state = 'first';
            setTimeout(() => { this.state = 'active'; }, 10);

            setTimeout(() => {
           // this.hide.bind(this)(note); }, 3000);
           this.state = 'inactive'; }, note.delay);
        });
    }
    ngOnInit() {
    }

    hide(note) {
        const index = this._notes.indexOf(note);
        if (index >= 0) {
            this._notes.splice(index, 1);
        }
    }
    handleDone(note): void {
       // this.hide.bind(this)(note);
     //  console.log('animation done' + JSON.stringify(note));
       // this.hide(note);
       if (this.state === 'inactive') {
           this.hide(note);
       }
    }
}
