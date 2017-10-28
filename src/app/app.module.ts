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
import { AppRoutingModule } from './app-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserService } from './users/user.service';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { RegisterComponent } from './users/register/register.component';
import { AlertComponent } from './_directives/alert.component';
import { AlertService } from './services/alert.service';
import { RequestresetComponent } from './users/requestreset/requestreset.component';
import { AdminComponent } from './admin/admin.component';
import { ClassListComponent } from './classes/class-list/class-list.component';
import { CourseEditComponent } from './courses/course-edit/course-edit.component';
import { CourseService } from './courses/course.service';
import { ClassService } from './classes/class.service';
import { ClassEditComponent } from './classes/class-edit/class-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserListComponent } from './users/user-list/user-list.component';
import { UploadComponent } from './assets/upload.component';
import { AssetService } from './assets/asset.service';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { UserSettingsComponent } from './users/settings/user-settings.component';
import { SafeUrlPipe } from './shared/safe-url.pipe';
import { Error404Component } from './errors/404component';
import { AdminRouteActivator } from './admin/admin-route-activator';
import { MaterialEditComponent } from './materials/material-edit.component';
import { MaterialService } from './materials/material.service';
import { HomeComponent } from './home/home.component';
import { ClassComponent } from './classes/class/class.component';
import { CourseResolver } from './services/course-resolver.service';
import { DynamicFormComponent } from './shared/dynamic-form.component';
import { DynamicFormQuestionComponent } from './shared/dynamic-form-question.component';
import { MaterialsResolver } from './services/materials-resolver.service';
import { ClassesResolver } from './services/classes-resolver.service';
import { UsersResolver } from './services/users-resolver';
import { InstructorAssignmentsComponent } from './users/instructors/instructorassignments.component';
import { DialogComponent } from './classes/dialog.component';
import { PossibleInstructorsResolver } from './services/possible-instructors-resolver.service';
import { UserResolver } from './services/user-resolver';
import { UserThumbComponent } from './users/user-thumb/user-thumb.component';
import { CourseComponent } from './courses/course/course.component';
import { SectionComponent } from './courses/course/section.component';
import { ChatroomComponent } from './chat/chatroom.component';
import { BoardComponent } from './discuss/board.component';
import { DiscussionService } from './services/discussion.service';
import { ThreadComponent } from './discuss/thread.component';
import { ChatService } from './chat/chat.service';
import { ChatSocketService } from './services/chatsocket.service';
import { InfobotComponent } from './infobot/infobot.component';
import { NotificationsService } from './services/notifications.service';
import { NotificationsComponent } from './shared/notifications.component';

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
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  // Internal
  declarations: [
    AppComponent,
    DynamicFormComponent, DynamicFormQuestionComponent,
    FileSelectDirective,
    FileDropDirective,
    NavBarComponent,
    PageNotFoundComponent,
    SafeUrlPipe,
    LoginComponent,
    CourseListComponent,
    RegisterComponent,
    AlertComponent,
    WelcomeComponent,
    RequestresetComponent,
    ClassComponent,
    ClassListComponent,
    CourseEditComponent,
    ClassEditComponent,
    UserListComponent,
    HomeComponent,
    UploadComponent,
    UserSettingsComponent,
    AdminComponent,
    Error404Component,
    MaterialEditComponent,
    InstructorAssignmentsComponent,
    DialogComponent,
    UserThumbComponent,
    CourseComponent,
    SectionComponent,
    ChatroomComponent,
    BoardComponent,
    ThreadComponent,
    InfobotComponent,
    NotificationsComponent,

  ],

  providers: [ AuthGuard, UserService, AlertService,
    CourseService, ClassService, AssetService, AdminRouteActivator, MaterialService,
    CourseResolver, MaterialsResolver, ClassesResolver, UsersResolver, PossibleInstructorsResolver, UserResolver,
    DiscussionService, ChatService, ChatSocketService, NotificationsService
   ],
  bootstrap: [AppComponent ]
})
export class AppModule { }
