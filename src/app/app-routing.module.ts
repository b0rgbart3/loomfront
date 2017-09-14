import {NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterComponent } from './users/register/register.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { ProfileComponent } from './users/profile.component';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards/auth.guard';
// import { CanActivateAuthGuard } from './can-activate.service';

// const index_1 = require('./login/index');
// const index_2 = require('./home/index');
// const index_3 = require('./_guards/index');

const routes: Routes = [
{ path: 'login', component: LoginComponent },
{ path: '', pathMatch: 'full', component: CourseListComponent },
{ path: 'courses', pathMatch: 'full', component: CourseListComponent },
// { path: 'contacts', pathMatch: 'full', component: ContactListComponent, canActivate: [CanActivateAuthGuard] },
{ path: 'home', pathMatch: 'full', component: CourseListComponent, canActivate: [ AuthGuard ] },
{ path: 'register', pathMatch: 'full', component: RegisterComponent },
{ path: 'users', pathMatch: 'full', component: UserListComponent, canActivate: [ AuthGuard ] },
{ path: '**', redirectTo: '' }
];

@NgModule ({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {
}

export const routableComponents = [ UserListComponent, RegisterComponent, CourseListComponent

];

