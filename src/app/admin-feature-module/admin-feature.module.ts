import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin/admin.component';
import { AdminRouteActivator } from './admin/admin-route-activator';
import { ClassEditComponent } from './class-edit/class-edit.component';
import { CourseBuilderComponent } from './course-builder/course-builder.component';
import { Error404Component } from '../errors/404component';
import { WelcomeComponent } from '../welcome/welcome.component';
import { CourseEditComponent } from './course-edit/course-edit.component';
import { CourseResolver } from '../services/course-resolver.service';
import { MaterialsResolver } from '../services/materials-resolver.service';
import { MaterialEditComponent } from './material-edit-component/material-edit.component';
import { ClassResolver } from '../services/class-resolver.service';
import { UsersResolver } from '../services/users-resolver';
import { PossibleInstructorsResolver } from '../services/possible-instructors-resolver.service';
import { CoursesResolver } from '../services/courses-resolver.service';



@NgModule ( {
    imports: [
        SharedModule,
        RouterModule.forChild([
            { path: 'admin', pathMatch: 'full', component: AdminComponent,
                canActivate: [ AdminRouteActivator ] },
            { path: 'courses/:id/edit', pathMatch: 'full', component: CourseEditComponent,
            resolve: { course: CourseResolver,
                materials: MaterialsResolver } },
            { path: 'coursebuilder', component: CourseBuilderComponent },

            { path: 'classedit/:id', pathMatch: 'full', component: ClassEditComponent, resolve: {
    thisClass: ClassResolver, users: UsersResolver,
    possibleInstructors: PossibleInstructorsResolver, courses: CoursesResolver } },

            { path: 'book/:id/edit', component: MaterialEditComponent,
            data: { type: 'book'}, resolve: { MaterialsResolver } },

            { path: 'doc/:id/edit', component:  MaterialEditComponent,
            data: { type: 'doc' }, resolve: { MaterialsResolver } },

            { path: 'video/:id/edit', component:  MaterialEditComponent,
            data: { type: 'video' }, resolve: { MaterialsResolver } },

            { path: 'audio/:id/edit', component:  MaterialEditComponent,
            data: { type: 'audio' }, resolve: { MaterialsResolver } },

            { path: 'quote/:id/edit', component:  MaterialEditComponent,
            data: { type: 'quote' }, resolve: { MaterialsResolver } },

            { path: 'block/:id/edit', component:  MaterialEditComponent,
            data: { type: 'block' }, resolve: { MaterialsResolver } },

            { path: '404', component: Error404Component },
            { path: '', component: WelcomeComponent },
            { path: '**', component: WelcomeComponent }
        ])
    ],
    declarations: [
       AdminComponent,
       ClassEditComponent,
       CourseBuilderComponent,
       CourseEditComponent,
       MaterialEditComponent,

    ],
    providers: [
        AdminRouteActivator,
        ClassResolver,
        UsersResolver,
        CourseResolver,
    ],
    exports: [
        AdminComponent,
        ClassEditComponent,
        CourseBuilderComponent,
        CourseEditComponent,
        MaterialEditComponent,

    ]
})

export class AdminFeatureModule { }

