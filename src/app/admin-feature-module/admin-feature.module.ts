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
import { EnrollmentsResolver } from '../resolvers/enrollments-resolver';
import { EnrollmentStudentTabComponent } from './enrollments/enrollment-student-tab.component';
import { EnrollmentInstructorTabComponent } from './enrollments/enrollment-instructor-tab.component';
import { StudentEnrollmentsResolver } from '../resolvers/studentenrollments-resolver.service';
import { InstructorAssignmentsResolver } from '../resolvers/instructorassignments-resolver.service';
import { AllStudentEnrollmentsResolver } from '../resolvers/allstudentenrollments-resolver.service';
import { AllInstructorAssignmentsResolver } from '../resolvers/allinstructorassignments-resolver.service';
import { UserListComponent } from './admin/user-list/user-list.component';
import { InstructorsResolver } from '../resolvers/instructors-resolver.service';


@NgModule ( {
    imports: [
        SharedModule,
        FileUploadModule,
        RouterModule.forChild([
            { path: 'admin', pathMatch: 'full', component: AdminComponent,
                canActivate: [ AdminRouteActivator ], resolve: { users: UsersResolver, instructors: InstructorsResolver } },
            { path: 'courses/:id/edit', pathMatch: 'full', component: CourseEditComponent,
            resolve: { course: CourseResolver,
                materials: MaterialsResolver }},

            { path: 'coursebuilder', component: CourseBuilderComponent },

            { path: 'enrollments', component: EnrollmentEditComponent, resolve: {
                users: UsersResolver, classes: ClassesResolver, enrollments: EnrollmentsResolver
            },
                children: [
                { path: '', redirectTo: 'students', pathMatch: 'full' },
                { path: 'students', component: EnrollmentStudentTabComponent, resolve: {
                    users: UsersResolver, classes: ClassesResolver, enrollments: AllStudentEnrollmentsResolver
                } },
                { path: 'instructors', component: EnrollmentInstructorTabComponent, resolve: {
                    users: UsersResolver, classes: ClassesResolver, enrollments: AllInstructorAssignmentsResolver
                } }
            ]  },
            { path: 'classedit/:id', pathMatch: 'full', component: ClassEditComponent, resolve: {
    thisClass: ClassResolver, courses: CoursesResolver  } },

            { path: 'series/:id/edit', component: SeriesEditComponent, resolve: { series: SeriesResolver} },

            { path: 'book/:id/edit', component: MaterialEditComponent,
            data: { type: 'book'}, resolve: { MaterialsResolver } },

            { path: 'image/:id/edit', component: MaterialEditComponent,
            data: { type: 'image'}, resolve: { MaterialsResolver } },

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
       SeriesEditComponent,
       EnrollmentEditComponent,
       EnrollmentStudentTabComponent,
       EnrollmentInstructorTabComponent,
       UserListComponent
    ],
    providers: [
        AdminRouteActivator,
        ClassResolver,
        UsersResolver,
        CourseResolver,
        InstructorsResolver
    ],
    exports: [
        AdminComponent,
        ClassEditComponent,
        CourseBuilderComponent,
        CourseEditComponent,
        MaterialEditComponent,
        SeriesEditComponent,
        EnrollmentEditComponent,
        UserListComponent
    ]
})

export class AdminFeatureModule { }

