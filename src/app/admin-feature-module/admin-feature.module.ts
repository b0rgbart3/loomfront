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
import { CourseResolver } from '../resolvers/course-resolver.service';
import { MaterialsResolver } from '../resolvers/materials-resolver.service';
import { MaterialEditComponent } from './material-edit-component/material-edit.component';
import { ClassResolver } from '../resolvers/class-resolver.service';
import { UsersResolver } from '../resolvers/users-resolver';
import { PossibleInstructorsResolver } from '../resolvers/possible-instructors-resolver.service';
import { CoursesResolver } from '../resolvers/courses-resolver.service';
import { FileUploadModule } from 'ng2-file-upload';
import { SeriesEditComponent } from './series-edit/series-edit.component';
import { SeriesResolver } from '../resolvers/series-resolver.service';
import { EnrollmentEditComponent } from './enrollments/enrollment-edit.component';
import { ClassesResolver } from '../resolvers/classes-resolver.service';
import { EnrollmentsResolver } from '../resolvers/enrollments-resolver.service';
import { AssignmentsResolver } from '../resolvers/assignments-resolver.service';
import { AllEnrollmentsResolver } from '../resolvers/allenrollments-resolver.service';
import { AllAssignmentsResolver } from '../resolvers/allassignments-resolver.service';
import { UserListComponent } from './admin/user-list/user-list.component';
import { InstructorsResolver } from '../resolvers/instructors-resolver.service';
import { ContentComponent } from './admin/content.component';
import { StudentsComponent } from './admin/students.component';
import { InstructorsComponent } from './admin/instructors.component';
import { SerieResolver } from '../resolvers/serie-resolver';
import { EnrollmentsComponent } from './admin/enrollments.component';
import { AssignmentsComponent } from './admin/assignments.component';
import { MaterialsAdminComponent } from './admin/materials-admin.component';
import { CourseEditGuard } from './course-edit/course-edit-guard.service';
import { CourseObjectEditComponent } from './courseObject-edit/courseObject-edit.component';
import { SectionEditComponent } from './courseObject-edit/section-edit.component';
import { CourseObjectEditGuard } from './courseObject-edit/courseObject-edit-guard.service';
import { AllMaterialsResolver } from '../resolvers/all-materials-resolver.service';
import { NewMaterialModalComponent } from './courseObject-edit/new-material-modal.component';
import { MaterialEditGuard } from './material-edit-component/material-edit-guard.service';
import { MaterialLineItemComponent } from './courseObject-edit/material-line-item.component';




@NgModule ( {
    imports: [
        SharedModule,
        FileUploadModule,
        RouterModule.forChild([
            { path: 'admin', component: AdminComponent,
                canActivate: [ AdminRouteActivator ],
                resolve: { users: UsersResolver, instructors: InstructorsResolver },
                children: [
                    { path: '', redirectTo: 'classes', pathMatch: 'full' },
                    { path: 'students', component: StudentsComponent, resolve: { users: UsersResolver,
                        classes: ClassesResolver, enrollments: AllEnrollmentsResolver }},
                    // { path: 'enrollments', component: EnrollmentsComponent, resolve: {
                    //     users: UsersResolver, classes: ClassesResolver, enrollments: AllEnrollmentsResolver }},
                    { path: 'instructors', component: InstructorsComponent,
                        resolve: { users: UsersResolver, instructors: InstructorsResolver,
                            classes: ClassesResolver, assignments: AllAssignmentsResolver }},
                    // { path: 'assignments', component: AssignmentsComponent, resolve: {
                    //     users: UsersResolver, classes: ClassesResolver, assignments: AllAssignmentsResolver }},
                    { path: 'classes/:id/edit', component: ClassEditComponent, resolve: { users: UsersResolver,
                        thisClass: ClassResolver, courses: CoursesResolver
                    }},
                    { path: 'classes', component: ContentComponent,
                    resolve: { users: UsersResolver, instructors: InstructorsResolver,
                        classes: ClassesResolver, series: SeriesResolver, courses: CoursesResolver }},
                    { path: 'materials', component: MaterialsAdminComponent,
                    resolve: { courses: CoursesResolver, materials: AllMaterialsResolver}},
                    { path: 'courses/:id/edit', pathMatch: 'full', component: CourseEditComponent,
                    canDeactivate: [ CourseEditGuard ],
                    resolve: { course: CourseResolver,
                        allmaterials: AllMaterialsResolver }},
                    { path: 'courseObjects/:id/edit', pathMatch: 'full', component: CourseObjectEditComponent,
                    canDeactivate: [ CourseObjectEditGuard ],
                    resolve: { course: CourseResolver,
                        allmaterials: AllMaterialsResolver }},
                    { path: 'series/:id/edit', component: SeriesEditComponent,
                    canDeactivate: [ MaterialEditGuard ], resolve: { series: SerieResolver} },
                    { path: 'book/:id/edit', component: MaterialEditComponent,
                    canDeactivate: [ MaterialEditGuard ], data: { type: 'book'}},

                    { path: 'image/:id/edit', component: MaterialEditComponent,
                    canDeactivate: [ MaterialEditGuard ], data: { type: 'image'}},

                    { path: 'doc/:id/edit', component:  MaterialEditComponent,
                    canDeactivate: [ MaterialEditGuard ], data: { type: 'doc' } },

                    { path: 'video/:id/edit', component:  MaterialEditComponent,
                    canDeactivate: [ MaterialEditGuard ], data: { type: 'video' } },

                    { path: 'audio/:id/edit', component:  MaterialEditComponent,
                    canDeactivate: [ MaterialEditGuard ], data: { type: 'audio' } },

                    { path: 'quote/:id/edit', component:  MaterialEditComponent,
                    canDeactivate: [ MaterialEditGuard ], data: { type: 'quote' } },

                   { path: 'block/:id/edit', component:  MaterialEditComponent,
                   canDeactivate: [ MaterialEditGuard ], data: { type: 'block' } },

                ]
            },



            { path: '404', component: Error404Component },
            { path: '', component: WelcomeComponent },
            { path: '**', redirectTo: '' }
        ])
    ],
    declarations: [
       AdminComponent,
       ClassEditComponent,
       CourseBuilderComponent,
       CourseEditComponent,
       MaterialEditComponent,
       SeriesEditComponent,
       EnrollmentEditComponent,
       UserListComponent,
       ContentComponent,
       StudentsComponent,
       InstructorsComponent,
       ContentComponent,
       EnrollmentsComponent,
       AssignmentsComponent,
       CourseObjectEditComponent,
       SectionEditComponent,
       MaterialsAdminComponent,
       NewMaterialModalComponent,
       MaterialLineItemComponent
    ],
    providers: [
        AdminRouteActivator,
        ClassResolver,
        UsersResolver,
        CourseResolver,
        InstructorsResolver,
        SerieResolver,
        SeriesResolver,
        CourseEditGuard,
        CourseObjectEditGuard,
        MaterialEditGuard
    ],
    exports: [
        AdminComponent,
        ClassEditComponent,
        CourseBuilderComponent,
        CourseEditComponent,
        MaterialEditComponent,
        SeriesEditComponent,
        EnrollmentEditComponent,
        UserListComponent,
        CourseObjectEditComponent,
        AssignmentsComponent,
        SectionEditComponent,
        MaterialsAdminComponent,
        NewMaterialModalComponent,
        MaterialLineItemComponent
    ]
})

export class AdminFeatureModule { }

