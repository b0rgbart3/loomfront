import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from '../app-routing.module';
import { CustomMaterialModule } from '../custom-material/custom-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { VgCoreModule } from 'videogular2/src/core/core';
import { VgControlsModule } from 'videogular2/src/controls/controls';
import { VgOverlayPlayModule } from 'videogular2/src/overlay-play/overlay-play';
import { VgBufferingModule } from 'videogular2/src/buffering/buffering';
import { UserThumbComponent } from '../users/user-thumb/user-thumb.component';
import { Error404Component } from '../errors/404component';
import { WelcomeComponent } from '../welcome/welcome.component';
import { ClassListComponent } from '../classes/class-list/class-list.component';
import { ClassThumbComponent } from '../classes/class-list/class-thumb.component';
// import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { ClassResolver } from '../services/class-resolver.service';
import { ClickOutsideDirective } from '../_directives/clickOutside.directive';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';


@NgModule ( {
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        AppRoutingModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        CustomMaterialModule
    ],
    declarations: [
        UserThumbComponent,
        Error404Component,
        WelcomeComponent,
        ClassListComponent,
        ClassThumbComponent,
      //   ImageUploaderComponent,
        ClickOutsideDirective,
        PageNotFoundComponent
    ],
    providers: [
        ClassResolver,
    ],
    exports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        HttpModule,
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
        ClickOutsideDirective
    ]

})

export class SharedModule {}

