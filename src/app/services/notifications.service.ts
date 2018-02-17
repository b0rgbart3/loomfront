import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Notification } from '../models/notifications.model';

@Injectable()
export class NotificationsService {
    private _notifications = new Subject<Notification>();

    public noteAdded = this._notifications.asObservable();

    public add(notification: Notification) {
        this._notifications.next(notification);
    }

    public sendNotice(data) {
        this.add( new Notification( data.type, data.message, data.delay ) );
      }
}
