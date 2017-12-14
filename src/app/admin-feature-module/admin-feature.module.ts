import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin/admin.component';
import { AdminRouteActivator } from './admin/admin-route-activator';
import { ClassEditComponent } from './class-edit/class-edit.component';
import { CourseBuilderComponent } from './course-builder/course-builder.component';

@NgModule ( {
    imports: [
        SharedModule,
        RouterModule.forChild([
            { path: 'admin', component: AdminComponent }
        ])
    ],
    declarations: [
       AdminComponent,
       ClassEditComponent,
       CourseBuilderComponent,
    ],
    providers: [
        AdminRouteActivator,
    ],
    exports: [
        AdminComponent,
        ClassEditComponent,
        CourseBuilderComponent
    ]
})

export class AdminFeatureModule { }

