import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HttpModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { CustomMaterialModule } from '../custom-material/custom-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
//import { VgCoreModule } from 'videogular2/src/core/core';
import {VgCoreModule } from '@videogular/ngx-videogular/core';
// import { VgControlsModule } from 'videogular2/src/controls/controls';
import {VgControlsModule } from '@videogular/ngx-videogular/controls';
//import { VgOverlayPlayModule } from 'videogular2/src/overlay-play/overlay-play';
import {VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
// import { VgBufferingModule } from 'videogular2/src/buffering/buffering';
import {VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { UserThumbComponent } from '../users/user-thumb/user-thumb.component';
import { Error404Component } from '../errors/404component';
import { WelcomeComponent } from '../welcome/welcome.component';
import { ClassListComponent } from '../classes/class-list/class-list.component';
import { ClassThumbComponent } from '../classes/class-list/class-thumb.component';
// import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { ClassResolver } from '../resolvers/class-resolver.service';
import { ClickOutsideDirective } from '../_directives/clickOutside.directive';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { MessageService } from '../services/message.service';
import { ConnectionComponent } from './connection.component';
import { NavBarComponent } from '../navbar/nav-bar.component';
import { BioPopComponent } from '../classes/class/biopop.component';
import { PermissionComponent } from '../users/permission.component';
import { SuspendedComponent } from '../users/suspended/suspended.component';
import { ContactComponent } from '../welcome/contact/contact.component';
import { ContactService } from '../services/contact.service';
import { VideoComponent } from '../materials/video/video.component';
import { Video } from '../models/video.model';
//import { DragulaModule } from 'ng2-dragula';
import { ChoiceModalComponent } from '../modals/choice-modal.component';

import { MaterialIconComponent } from '../materials/icon/material-icon.component';
import { DisplayMaterialsComponent } from '../materials/display-materials/display-materials.component';
import { AudioComponent } from '../materials/audio/audio.component';
import { ImageComponent } from '../materials/image/image.component';
import { BookComponent } from '../materials/books/books/book.component';
import { BlockComponent } from '../materials/block/block.component';
import { ModalComponent } from '../materials/modal/modal.component';
import { DocComponent } from '../materials/doc/doc.component';
import { QuoteComponent } from '../materials/quote/quote.component';
import { EnrollmentsService } from '../services/enrollments.service';
import { ImageCropperComponent } from 'ngx-img-cropper';
import { AnnouncementsService } from '../services/announcements.service';
import { AnnouncementsResolver } from '../resolvers/announcements-resolver.service';
import { MakeAnnouncementComponent } from '../classes/class/makeannouncement.component';
import { AllAnnouncementsResolver } from '../resolvers/allannouncements.resolver';

// took out:         HttpModule,

@NgModule ( {
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        CustomMaterialModule,
        FlashMessagesModule


    ],
    declarations: [
        UserThumbComponent,
        Error404Component,
        WelcomeComponent,
        ClassListComponent,
        ClassThumbComponent,
      //   ImageUploaderComponent,
        ClickOutsideDirective,
        PageNotFoundComponent,
        ConnectionComponent,
        NavBarComponent,
        BioPopComponent,
        PermissionComponent,
        SuspendedComponent,
        ContactComponent,
        VideoComponent,
        AudioComponent,
        ImageComponent,
        BookComponent,
        BlockComponent,
        DocComponent,
        QuoteComponent,
        ModalComponent,
        ChoiceModalComponent,
        MaterialIconComponent,
        DisplayMaterialsComponent,
        MakeAnnouncementComponent,

    ],
    providers: [
        ClassResolver,
        MessageService,
        ContactService,
        EnrollmentsService,
        AnnouncementsService,
        AnnouncementsResolver,
        AllAnnouncementsResolver
    ],
    exports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        CustomMaterialModule,


        UserThumbComponent,
        Error404Component,
        WelcomeComponent,
        ClassListComponent,
        ClassThumbComponent,
        // ImageUploaderComponent,
        ClickOutsideDirective,
        FlashMessagesModule,
        ConnectionComponent,
        NavBarComponent,
        BioPopComponent,
        PermissionComponent,
        SuspendedComponent,
        ContactComponent,
        VideoComponent,
        AudioComponent,
        ImageComponent,
        BookComponent,
        BlockComponent,
        DocComponent,
        QuoteComponent,
        ModalComponent,
        ChoiceModalComponent,
        MaterialIconComponent,
        DisplayMaterialsComponent,
        MakeAnnouncementComponent,

    ]

})

export class SharedModule {}

