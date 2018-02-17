import { NgModule, Input } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { SignupComponent } from './users/signup/signup.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
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
import { ResetComponent } from './users/reset/reset.component';
import { DiscussionSettingsResolver } from './services/discussion-settings-resolver';
import { ClassCourseResolver } from './services/class-course-resolver.service';
import { StudentEnrollmentsResolver } from './services/studentenrollments-resolver.service';
import { InstructorAssignmentsResolver } from './services/instructorassignments-resolver.service';
import { EnrollmentsResolver } from './services/enrollments-resolver';



const ROUTES: Routes = [
{ path: 'welcome', pathMatch: 'full', component: WelcomeComponent },
{ path: 'signup', pathMatch: 'full', component: SignupComponent,
resolve: { user: UserResolver, users: UsersResolver} },
{ path: 'login', pathMatch: 'full', component: LoginComponent },
{ path: 'requestreset', pathMatch: 'full', component: RequestresetComponent },
{ path: 'home', component: HomeComponent, resolve: { users: UsersResolver,
    classes: ClassesResolver, courses: CoursesResolver,
     studentenrollments: StudentEnrollmentsResolver,
     instructorassignments: InstructorAssignmentsResolver
} },

// This is a component-less parent route that only has one child (so far)
// but this allows me to resolve the class data before loading the child (section)
{ path: 'classes/:id', resolve: { thisClass: ClassResolver, users: UsersResolver, enrollments: EnrollmentsResolver},
  children: [ {
      path: ':id2', pathMatch: 'full', component: ClassComponent,
resolve: {
    discussionSettings: DiscussionSettingsResolver  } }]
},

{ path: 'usersettings/:id/edit', pathMatch: 'full', component: UserSettingsComponent,
 canActivate: [ AuthGuard, UserAuthGuard ] },
{ path: 'reset/:key', component: ResetComponent },
];


@NgModule ({
    imports: [RouterModule.forRoot(ROUTES, { useHash: false })],
    exports: [RouterModule]
})

export class AppRoutingModule { }


