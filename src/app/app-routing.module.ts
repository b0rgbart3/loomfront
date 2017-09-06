import {NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterComponent } from './users/register/register.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { ProfileComponent } from './users/profile.component';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';
// import { CanActivateAuthGuard } from './can-activate.service';

const routes: Routes = [
{ path: '', pathMatch: 'full', component: CourseListComponent },
{ path: 'courses', pathMatch: 'full', component: CourseListComponent },
// { path: 'contacts', pathMatch: 'full', component: ContactListComponent, canActivate: [CanActivateAuthGuard] },
{ path: 'profile', pathMatch: 'full', component: ProfileComponent },
{ path: 'home', pathMatch: 'full', component: CourseListComponent },
{ path: 'login', pathMatch: 'full', component: CourseListComponent },
{ path: 'register', pathMatch: 'full', component: RegisterComponent },
{ path: 'users', pathMatch: 'full', component: UserListComponent },
];

@NgModule ({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}

export const routableComponents = [

];

