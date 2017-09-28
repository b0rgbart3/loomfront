import { NgModule } from '@angular/core';
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

// import { CanActivateAuthGuard } from './can-activate.service';

// const index_1 = require('./login/index');
// const index_2 = require('./home/index');
// const index_3 = require('./_guards/index');

const ROUTES: Routes = [
{ path: 'welcome', pathMatch: 'full', component: WelcomeComponent },
{ path: 'register', pathMatch: 'full', component: RegisterComponent },
{ path: 'login', pathMatch: 'full', component: LoginComponent },
{ path: 'requestreset', pathMatch: 'full', component: RequestresetComponent },
{ path: 'admin', pathMatch: 'full', component: AdminComponent },
{ path: 'courses/:id/edit', component: CourseEditComponent },
{ path: 'classes/:id/edit', component: ClassEditComponent },
{ path: 'users/:id/edit', pathMatch: 'full', component: RegisterComponent },
{ path: 'upload', pathMatch: 'full', component: UploadComponent },
{ path: 'usersettings', component: UserSettingsComponent },
{ path: '', component: WelcomeComponent },
{ path: '**', component: WelcomeComponent }
];

@NgModule ({
    imports: [RouterModule.forRoot(ROUTES)],
    exports: [RouterModule]
})

export class AppRoutingModule {
}


