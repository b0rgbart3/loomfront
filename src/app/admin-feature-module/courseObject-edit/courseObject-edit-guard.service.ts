import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { CourseObjectEditComponent } from './courseObject-edit.component';

@Injectable()
export class CourseObjectEditGuard implements CanDeactivate <CourseObjectEditComponent> {

    canDeactivate( component: CourseObjectEditComponent): boolean {

        if (component.isDirty()) {
            return confirm('You have made changes to this Course.' +
            ' Are you sure you want to navigate away and lose all changes you\'ve made to this course?');
        }

        return true;
    }
}
