import { NgModule, Input } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterComponent } from './users/register/register.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
// import { ProfileComponent } from './users/profile.component';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { RequestresetComponent } from './users/requestreset/requestreset.component';
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
import { DiscussionComponent } from './discuss/discussion.component';
import { SectionResolver } from './services/section-resolver.service';
import { CoursesResolver } from './services/courses-resolver.service';
import { ClassResolver } from './services/class-resolver.service';
import { AuthGuard } from './services/auth-guard.service';
import { UserAuthGuard } from './services/user-auth-guard.service';
import { BookResolver } from './services/book-resolver.service';



const ROUTES: Routes = [
{ path: 'welcome', pathMatch: 'full', component: WelcomeComponent },
{ path: 'register', pathMatch: 'full', component: RegisterComponent,
resolve: { user: UserResolver, users: UsersResolver} },
{ path: 'login', pathMatch: 'full', component: LoginComponent },
{ path: 'requestreset', pathMatch: 'full', component: RequestresetComponent },
{ path: 'home', pathMatch: 'full', component: HomeComponent },

{ path: 'classes/:id/:id2', pathMatch: 'full', component: ClassComponent, resolve: {
    thisClass: ClassResolver, section: SectionResolver, users: UsersResolver }},
{ path: 'classes/:id', pathMatch: 'full', component: ClassComponent,
resolve: { thisClass: ClassResolver, users: UsersResolver } },

{ path: 'usersettings/:id/edit', pathMatch: 'full', component: UserSettingsComponent,
 canActivate: [ AuthGuard, UserAuthGuard ] },
{ path: 'chatroom/:id', component: ChatroomComponent,
resolve: { thisClass: ClassesResolver, users: UsersResolver }},
{ path: 'discussion/:id', component: DiscussionComponent,
resolve: { thisClass: ClassesResolver, users: UsersResolver }},
{ path: 'usersettings', component: UserSettingsComponent },

];


@NgModule ({
    imports: [RouterModule.forRoot(ROUTES)],
    exports: [RouterModule]
})

export class AppRoutingModule { }


