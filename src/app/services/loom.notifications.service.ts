import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { LoomNotification } from '../models/loom.notification.model';

@Injectable()
export class LoomNotificationsService {
    private _notifications = new Subject<LoomNotification>();

    public noteAdded = this._notifications.asObservable();

    public add(notification: LoomNotification) {
        this._notifications.next(notification);
    }

    public sendNotice(data) {
        this.add( new LoomNotification( data.type, data.message, data.delay ) );
      }
}
