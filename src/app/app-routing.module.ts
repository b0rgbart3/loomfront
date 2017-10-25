import { NgModule, Input } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterComponent } from './users/register/register.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { ProfileComponent } from './users/profile.component';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards/auth.guard';
import { WelcomeComponent } from './welcome/welcome.component';
import { RequestresetComponent } from './users/requestreset/requestreset.component';
import { AdminComponent } from './admin/admin.component';
import { CourseEditComponent } from './courses/course-edit/course-edit.component';
import { ClassEditComponent } from './classes/class-edit/class-edit.component';
import { UploadComponent } from './assets/upload.component';
import { UserSettingsComponent } from './users/settings/user-settings.component';
import { Error404Component } from './errors/404component';
import { AdminRouteActivator } from './admin/admin-route-activator';
import { MaterialEditComponent } from './materials/material-edit.component';
import { HomeComponent } from './home/home.component';
import { ClassComponent } from './classes/class/class.component';
import { CourseResolver } from './services/course-resolver.service';
import { MaterialsResolver } from './services/materials-resolver.service';
import { ClassesResolver } from './services/classes-resolver.service';
import { InstructorAssignmentsComponent } from './users/instructors/instructorassignments.component';
import { UsersResolver } from './services/users-resolver';
import { PossibleInstructorsResolver } from './services/possible-instructors-resolver.service';
import { UserResolver } from './services/user-resolver';
import { ChatroomComponent } from './chat/chatroom.component';
import { BoardComponent } from './discuss/board.component';

// import { CanActivateAuthGuard } from './can-activate.service';

// const index_1 = require('./login/index');
// const index_2 = require('./home/index');
// const index_3 = require('./_guards/index');

const ROUTES: Routes = [
{ path: 'welcome', pathMatch: 'full', component: WelcomeComponent },
{ path: 'register', pathMatch: 'full', component: RegisterComponent, resolve: { user: UserResolver, users: UsersResolver} },
{ path: 'users/:id/edit', component: RegisterComponent, resolve: { user: UserResolver }},
{ path: 'login', pathMatch: 'full', component: LoginComponent },
{ path: 'requestreset', pathMatch: 'full', component: RequestresetComponent },
{ path: 'admin', pathMatch: 'full', component: AdminComponent, canActivate: [ AdminRouteActivator ] },
{ path: 'home', pathMatch: 'full', component: HomeComponent },
{ path: 'courses/:id/edit', component: CourseEditComponent, resolve: { course: CourseResolver, materials: MaterialsResolver} },
{ path: 'classes/:id', component: ClassComponent, resolve: { thisClass: ClassesResolver, users: UsersResolver } },
{ path: 'classes/:id/edit', component: ClassEditComponent, resolve: {
    thisClass: ClassesResolver, users: UsersResolver, possibleInstructors: PossibleInstructorsResolver } },
{ path: 'users/:id/edit', pathMatch: 'full', component: RegisterComponent },
{ path: 'materials/:id/edit', component: MaterialEditComponent },
// { path: 'upload', pathMatch: 'full', component: UploadComponent },
{ path: 'chatroom/:id', component: ChatroomComponent, resolve: { thisClass: ClassesResolver, users: UsersResolver }},
{ path: 'discussion/:id', component: BoardComponent, resolve: { thisClass: ClassesResolver, users: UsersResolver }},
{ path: 'usersettings', component: UserSettingsComponent },
{ path: 'instructorassignments', component: InstructorAssignmentsComponent, resolve: {users: UsersResolver } },
{ path: '404', component: Error404Component },
{ path: '', component: WelcomeComponent },
{ path: '**', component: WelcomeComponent }
];


@NgModule ({
    imports: [RouterModule.forRoot(ROUTES)],
    exports: [RouterModule]
})

export class AppRoutingModule { }


