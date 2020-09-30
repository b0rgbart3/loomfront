import { NgModule } from '@angular/core';
import { NavBarComponent } from './navbar/nav-bar.component';
import { AppComponent } from './app.component';
import 'hammerjs';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth-guard.service';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserService } from './services/user.service';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { SignupComponent } from './users/signup/signup.component';
import { AlertComponent } from './_directives/alert.component';
import { AlertService } from './services/alert.service';
import { RequestresetComponent } from './users/requestreset/requestreset.component';
import { CourseService } from './services/course.service';
import { ClassService } from './services/class.service';
import { UserSettingsComponent } from './users/settings/user-settings.component';
import { SafePipe } from './shared/safe.pipe';
import { MaterialService } from './services/material.service';
import { HomeComponent } from './home/home.component';
import { ClassComponent } from './classes/class/class.component';
import { CourseResolver } from './resolvers/course-resolver.service';
import { DynamicFormComponent } from './shared/dynamic-form.component';
import { DynamicFormQuestionComponent } from './shared/dynamic-form-question.component';
import { MaterialsResolver } from './resolvers/materials-resolver.service';
import { ClassesResolver } from './resolvers/classes-resolver.service';
import { UsersResolver } from './resolvers/users-resolver';
import { InstructorAssignmentsComponent } from './users/instructors/instructorassignments.component';
import { DialogComponent } from './classes/dialog.component';
import { PossibleInstructorsResolver } from './resolvers/possible-instructors-resolver.service';
import { UserResolver } from './resolvers/user-resolver';
import { SectionComponent } from './courses/course/section.component';
import { DiscussionComponent } from './discuss/discussion.component';
import { DiscussionService } from './services/discussion.service';
import { ThreadComponent } from './discuss/thread.component';
import { InfobotComponent } from './infobot/infobot.component';
import { LoomNotificationsService } from './services/loom.notifications.service';
import { LoomNotificationsComponent } from './shared/loom.notifications.component';
//import { ClassThumbComponent } from './classes/class-list/class-thumb.component';
import { SectionResolver } from './resolvers/section-resolver.service';
import { Globals } from './globals2';
//import { MatInputModule } from '@angular/material';
import { FacebookModule } from 'ngx-facebook';
import { LoomsFacebookService } from './services/loomsfacebook.service';
import { CoursesResolver } from './resolvers/courses-resolver.service';
import { ClassResolver } from './resolvers/class-resolver.service';
import { UserAuthGuard } from './services/user-auth-guard.service';
import { CourseImageComponent } from './courses/course-image/course-image.component';
import { MaterialCollectionComponent } from './materials/material-collection/material-collection.component';
//import { VideoComponent } from './materials/video/video.component';
// import { BooksComponent } from './materials/books/books/books.component';
import { BookComponent } from './materials/books/books/book.component';
import { QuoteComponent } from './materials/quote/quote.component';
import { SharedModule } from './shared/shared.module';
import { AdminFeatureModule } from './admin-feature-module/admin-feature.module';
import { ModalComponent } from './materials/modal/modal.component';
//import { EmbedVideo } from 'ngx-embed-video';
//import { AudioComponent } from './materials/audio/audio.component';
import { FileSelectDirective, FileDropDirective, FileUploader, FileUploadModule } from 'ng2-file-upload';
import { SeriesService } from './services/series.service';
import { SeriesResolver } from './resolvers/series-resolver.service';
//import { BlockComponent } from './materials/block/block.component';
//import { ImageComponent } from './materials/image/image.component';
import { ResetComponent } from './users/reset/reset.component';
import { HttpClientModule } from '@angular/common/http';
import { DiscussionSettingsResolver } from './resolvers/discussion-settings-resolver';
import { ClassCourseResolver } from './resolvers/class-course-resolver.service';
import { CourseComponent } from './courses/course/course.component';
import { EnrollmentsResolver } from './resolvers/enrollments-resolver.service';
//import { EnrollmentsService } from './services/enrollments.service';
import { AssignmentsResolver } from './resolvers/assignments-resolver.service';
import { AllEnrollmentsResolver } from './resolvers/allenrollments-resolver.service';
import { AllAssignmentsResolver } from './resolvers/allassignments-resolver.service';
import { ClassMaterialsResolver } from './resolvers/class-materials-resolver.service';
import { NotesComponent } from './discuss/notes.component';
import { NotesSettingsResolver } from './resolvers/notes-settings-resolver';
import { NotesService } from './services/notes.service';
import { MessageComponent } from './discuss/message.component';
import { MessagesResolver } from './resolvers/messages-resolver';
import { MessageService } from './services/message.service';
//import { Ng2ScrollableModule } from 'ng2-scrollable';
//import { BioPopComponent } from './classes/class/biopop.component';
import { AssignmentsService } from './services/assignments.service';
import { AllDiscussionSettingsResolver } from './resolvers/alldiscussion-settings-resolver';
//import { PermissionComponent } from './users/permission.component';
import { DragulaModule } from 'ng2-dragula/dist';
import { AllMaterialsResolver } from './resolvers/all-materials-resolver.service';
import { RegisterComponent } from './users/register/register.component';
import { UserSettingsGuard } from './users/settings/user-settings-edit-guard.service';
import { ImageCropperComponent, ImageCropperModule } from 'ngx-img-cropper/ngx-img-cropper';
import { ValidatorComponent } from './users/validate/validator.component';
import { Observable } from "rxjs/Observable";
import {VgApiService} from '@videogular/ngx-videogular/core';

  // External
//  EmbedVideo.forRoot(),

@NgModule({
  imports: [
    SharedModule,
    AdminFeatureModule,
    FacebookModule.forRoot(),
    FileUploadModule,
    HttpClientModule,
    DragulaModule.forRoot(),
    ImageCropperModule,
    Observable,
    VgApiService
  ],
  declarations: [
    AppComponent,
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    LoginComponent,
    CourseListComponent,
    CourseImageComponent,
    SignupComponent,
    AlertComponent,
    RequestresetComponent,
    ClassComponent,
    HomeComponent,
    UserSettingsComponent,
    InstructorAssignmentsComponent,
    DialogComponent,
    SectionComponent,
    DiscussionComponent,
    ThreadComponent,
    InfobotComponent,
    LoomNotificationsComponent,
    RegisterComponent,
    MaterialCollectionComponent,
    SafePipe,
    ResetComponent,
    CourseComponent,
    NotesComponent,
    MessageComponent,
    ValidatorComponent

  ],
  providers: [
    AlertService,
    AuthGuard,
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
    LoomNotificationsService,
    PossibleInstructorsResolver,
    SectionResolver,
    UserResolver,
    UsersResolver,
    UserService,
    AuthGuard,
    UserAuthGuard,
    SeriesService,
    SeriesResolver,
    DiscussionSettingsResolver,
    ClassCourseResolver,
    AssignmentsService,
    EnrollmentsResolver,
    AllEnrollmentsResolver,
    AssignmentsResolver,
    AllAssignmentsResolver,
    AllDiscussionSettingsResolver,
    ClassMaterialsResolver,
    NotesService,
    NotesSettingsResolver,
    MessageService,
    MessagesResolver,
    AllMaterialsResolver,
    UserSettingsGuard,
    VgApiService
   ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
