import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
// import { RouterModule, Routes } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { NavBarComponent } from './navbar/nav-bar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppComponent } from './app.component';
import { CanActivateAuthGuard } from './can-activate.service';
import { FormPoster } from './services/form-poster.service';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { FlashMessagesModule } from 'angular2-flash-messages';

import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards/index';
import { AuthenticationService } from './services/authentication.service';
import { AppRoutingModule } from './app-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserService } from './users/user.service';
import { StudentModule } from './student/student.module';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { RegisterComponent } from './users/register/register.component';
import { AlertComponent } from './_directives/alert.component';
import { AlertService } from './services/alert.service';
import { RequestresetComponent } from './users/requestreset/requestreset.component';
import { AdminComponent } from './admin/admin.component';
import { ClassListComponent } from './classes/class-list/class-list.component';
import { CourseEditComponent } from './courses/course-edit/course-edit.component';
import { CourseService } from './courses/course.service';

@NgModule({
  // External
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CustomMaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlashMessagesModule,
    StudentModule,
    AppRoutingModule
  ],
  // Internal
  declarations: [
    AppComponent,
    NavBarComponent,
    PageNotFoundComponent,
    LoginComponent,
    CourseListComponent,
    RegisterComponent,
    AlertComponent,
    WelcomeComponent,
    RequestresetComponent,
    ClassListComponent,
    CourseEditComponent,
    AdminComponent
  ],

  providers: [ AuthGuard, AuthenticationService, UserService, AlertService, CourseService
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
