import { NgModule, Input } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterComponent } from './users/register/register.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { ProfileComponent } from './users/profile.component';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';
import { LoginComponent } from './login/login.component';
// import { AuthGuard } from './_guards/auth.guard';
import { WelcomeComponent } from './welcome/welcome.component';
import { RequestresetComponent } from './users/requestreset/requestreset.component';
import { AdminComponent } from './admin-feature-module/admin/admin.component';
import { AdminRouteActivator } from './admin-feature-module/admin/admin-route-activator';
import { CourseEditComponent } from './courses/course-edit/course-edit.component';
import { ClassEditComponent } from './admin-feature-module/class-edit/class-edit.component';
import { UserSettingsComponent } from './users/settings/user-settings.component';
import { Error404Component } from './errors/404component';
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
import { SectionResolver } from './services/section-resolver.service';
import { CoursesResolver } from './services/courses-resolver.service';
import { ClassResolver } from './services/class-resolver.service';
import { AuthGuard } from './services/auth-guard.service';
import { UserAuthGuard } from './services/user-auth-guard.service';
import { BookResolver } from './services/book-resolver.service';
import { BookEditComponent } from './materials/books/book-edit.component';
import { CourseBuilderComponent } from './admin-feature-module/course-builder/course-builder.component';
import { BooksResolver } from './services/books-resolver.service';
import { MaterialEditComponent } from './materials/material-edit.component';

// import { CanActivateAuthGuard } from './can-activate.service';

// const index_1 = require('./login/index');
// const index_2 = require('./home/index');
// const index_3 = require('./_guards/index');

const ROUTES: Routes = [
{ path: 'welcome', pathMatch: 'full', component: WelcomeComponent },
{ path: 'register', pathMatch: 'full', component: RegisterComponent,
resolve: { user: UserResolver, users: UsersResolver} },
// { path: 'users/:id/edit', component: RegisterComponent, resolve: { user: UserResolver }},
{ path: 'login', pathMatch: 'full', component: LoginComponent },
{ path: 'requestreset', pathMatch: 'full', component: RequestresetComponent },
{ path: 'admin', pathMatch: 'full', component: AdminComponent,
canActivate: [ AdminRouteActivator ] },
{ path: 'coursebuilder', component: CourseBuilderComponent },
{ path: 'home', pathMatch: 'full', component: HomeComponent },
{ path: 'books/:id/edit', component: BookEditComponent },
{ path: 'courses/:id/edit', pathMatch: 'full', component: CourseEditComponent,
resolve: { course: CourseResolver, materials: MaterialsResolver, books: BooksResolver} },

{ path: 'classes/:id/edit', pathMatch: 'full', component: ClassEditComponent, resolve: {
    thisClass: ClassResolver, users: UsersResolver,
    possibleInstructors: PossibleInstructorsResolver, courses: CoursesResolver } },

{ path: 'classes/:id/:id2', component: ClassComponent, resolve: {
    thisClass: ClassResolver, section: SectionResolver, users: UsersResolver }},

{ path: 'classes/:id', component: ClassComponent,
resolve: { thisClass: ClassResolver, users: UsersResolver } },
{ path: 'usersettings/:id/edit', pathMatch: 'full', component: UserSettingsComponent,
 canActivate: [ AuthGuard, UserAuthGuard ] },
{ path: 'materials/:id/edit', component: MaterialEditComponent },
// { path: 'upload', pathMatch: 'full', component: UploadComponent },
{ path: 'chatroom/:id', component: ChatroomComponent,
resolve: { thisClass: ClassesResolver, users: UsersResolver }},
{ path: 'discussion/:id', component: BoardComponent,
resolve: { thisClass: ClassesResolver, users: UsersResolver }},
{ path: 'usersettings', component: UserSettingsComponent },
// { path: 'instructorassignments', component: InstructorAssignmentsComponent,
// resolve: {users: UsersResolver } },
{ path: '404', component: Error404Component },
{ path: '', component: WelcomeComponent },
{ path: '**', component: WelcomeComponent }
];


@NgModule ({
    imports: [RouterModule.forRoot(ROUTES)],
    exports: [RouterModule]
})

export class AppRoutingModule { }


