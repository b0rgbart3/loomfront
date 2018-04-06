import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { MaterialEditComponent } from './material-edit.component';

@Injectable()
export class MaterialEditGuard implements CanDeactivate <MaterialEditComponent> {

    canDeactivate( component: MaterialEditComponent): boolean {

        if (component.isDirty()) {
            return confirm('You have made changes to this ' + component.type +
            '. Are you sure you want to navigate away and lose all changes?');
        }

        return true;
    }
}
