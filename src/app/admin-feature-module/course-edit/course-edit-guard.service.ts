import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { CourseEditComponent } from './course-edit.component';

@Injectable()
export class CourseEditGuard implements CanDeactivate <CourseEditComponent> {

    canDeactivate( component: CourseEditComponent): boolean {

        if (component.courseFormGroup.dirty) {
            return confirm('Navigate away and lose all changes to this course?');
        }

        return true;
    }
}
