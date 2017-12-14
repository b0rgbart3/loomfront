import { NgModule } from '@angular/core';
import { NavBarComponent } from './navbar/nav-bar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppComponent } from './app.component';
import { FormPoster } from './services/form-poster.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import 'hammerjs';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth-guard.service';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserService } from './services/user.service';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { RegisterComponent } from './users/register/register.component';
import { AlertComponent } from './_directives/alert.component';
import { AlertService } from './services/alert.service';
import { RequestresetComponent } from './users/requestreset/requestreset.component';
import { ClassListComponent } from './classes/class-list/class-list.component';
import { CourseEditComponent } from './courses/course-edit/course-edit.component';
import { CourseService } from './courses/course.service';
import { ClassService } from './classes/class.service';
import { ClassEditComponent } from './classes/class-edit/class-edit.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { UserSettingsComponent } from './users/settings/user-settings.component';
import { SafeUrlPipe } from './shared/safe-url.pipe';
import { Error404Component } from './errors/404component';
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
import { MaterialComponent } from './materials/material.component';
import { ClassThumbComponent } from './classes/class-list/class-thumb.component';
import { SectionResolver } from './services/section-resolver.service';
import { Globals } from './globals';
import { MatInputModule } from '@angular/material';
import { FacebookModule } from 'ngx-facebook';
import { LoomsFacebookService } from './services/loomsfacebook.service';
import { CoursesResolver } from './services/courses-resolver.service';
import { ClassResolver } from './services/class-resolver.service';
import { UserAuthGuard } from './services/user-auth-guard.service';
import { CourseImageComponent } from './courses/course-image/course-image.component';
import { ClickOutsideDirective } from './_directives/clickOutside.directive';
import { MaterialCollectionComponent } from './materials/material-collection/material-collection.component';
import { VideoComponent } from './materials/video/video.component';
import { BookService } from './services/book.service';
import { BookResolver } from './services/book-resolver.service';
import { BookEditComponent } from './materials/books/book-edit.component';
import { CourseBuilderComponent } from './course-builder/course-builder.component';
import { BooksResolver } from './services/books-resolver.service';
import { BooksComponent } from './materials/books/books/books.component';
import { BookComponent } from './materials/books/books/book.component';
import { SharedModule } from './shared/shared.module';
import { AdminFeatureModule } from './admin-feature-module/admin-feature.module';
import { MaterialEditComponent } from './materials/material-edit.component';

@NgModule({
  // External
  imports: [
    FlashMessagesModule,
    SharedModule,
    AdminFeatureModule,
    FacebookModule.forRoot(),
  ],
  // Internal
  declarations: [
    AppComponent,
    ClickOutsideDirective,
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    FileSelectDirective,
    FileDropDirective,
    NavBarComponent,
    PageNotFoundComponent,
    SafeUrlPipe,
    LoginComponent,
    CourseListComponent,
    CourseImageComponent,
    RegisterComponent,
    AlertComponent,
    WelcomeComponent,
    RequestresetComponent,
    ClassComponent,
    ClassListComponent,
    ClassThumbComponent,
    CourseEditComponent,
    ClassEditComponent,
    UserListComponent,
    HomeComponent,
    UserSettingsComponent,
    Error404Component,
    InstructorAssignmentsComponent,
    DialogComponent,
    CourseComponent,
    SectionComponent,
    ChatroomComponent,
    BoardComponent,
    ThreadComponent,
    InfobotComponent,
    NotificationsComponent,
    VideoComponent,
    BookEditComponent,
    CourseBuilderComponent,
    BooksComponent,
    BookComponent,
    MaterialEditComponent,
    MaterialCollectionComponent,

  ],
  providers: [
    AlertService,
    AuthGuard,
    ChatService,
    ChatSocketService,
    ClassService,
    ClassResolver,
    ClassesResolver,
    CourseService,
    CourseResolver,
    CoursesResolver,
    DiscussionService,
    Globals,
    LoomsFacebookService,
    MaterialService,
    MaterialsResolver,
    NotificationsService,
    PossibleInstructorsResolver,
    SectionResolver,
    UserResolver,
    UsersResolver,
    UserService,
    AuthGuard,
    UserAuthGuard,
    BookService,
    BookResolver,
    BooksResolver
   ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
