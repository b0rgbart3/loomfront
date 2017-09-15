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
import { HomeComponent } from './home/home.component';

// import { CanActivateAuthGuard } from './can-activate.service';

// const index_1 = require('./login/index');
// const index_2 = require('./home/index');
// const index_3 = require('./_guards/index');

const routes: Routes = [
{ path: '', pathMatch: 'full', component: HomeComponent },
{ path: 'home', pathMatch: 'full', component: HomeComponent },
{ path: 'login', pathMatch: 'full', component: LoginComponent },
];

@NgModule ({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {
}


