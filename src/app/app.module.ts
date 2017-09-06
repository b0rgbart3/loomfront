import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule, routableComponents } from './app-routing.module';

import { NavBarComponent } from './navbar/nav-bar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UsersComponent } from './users/users.component';
import { CourseListComponent } from './courses/course-list/course-list.component';

import { AppComponent } from './app.component';

import { ContactDetailsComponent } from './contacts/contact-details/contact-details.component';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';

import { CanActivateAuthGuard } from './can-activate.service';
import { UserService } from './users/user.service';
import { UserListComponent } from './users/user-list/user-list.component';

import { RegisterComponent } from './users/register/index';
import { ProfileComponent } from './users/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    routableComponents,
    ContactDetailsComponent,
    ContactListComponent,
    CourseListComponent,
    UserListComponent,
    NavBarComponent,
    ProfileComponent,
    PageNotFoundComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
  ],
  providers: [ CanActivateAuthGuard, UserService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
