import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { UserSettingsComponent } from './user-settings.component';


@Injectable()
export class UserSettingsGuard implements CanDeactivate <UserSettingsComponent> {

    canDeactivate( component: UserSettingsComponent): boolean {

        if (component.settingsForm.dirty || component.avatarChanged) {
            return confirm('Navigate away and lose the changes you\'ve made to your Profile Settings?');
        }

        return true;
    }
}
