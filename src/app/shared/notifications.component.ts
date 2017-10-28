import { Component } from '@angular/core';

import { NotificationsService } from '../services/notifications.service';
import { Notification } from '../models/notifications.model';

@Component({
    selector: 'notifications',
    template: `
    <div class="notifications" *ngFor='let note of _notes'>
        <div (click)="hide(note)" class="{{ note.type }}">
            {{ note.message }}
        </div>
    </div>
    `
})
export class NotificationsComponent {
    public _notes: Notification[];

    constructor(private _notifications: NotificationsService) {
        this._notes = new Array<Notification>();

        _notifications.noteAdded.subscribe(note => {
            this._notes.push(note);

            setTimeout(() => { this.hide.bind(this)(note); }, 3000);
        });
    }

    hide(note) {
        const index = this._notes.indexOf(note);

        if (index >= 0) {
            this._notes.splice(index, 1);
        }
    }
}
