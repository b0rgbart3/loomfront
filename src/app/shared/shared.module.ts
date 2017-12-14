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
        CustomMaterialModule,
    ],
    declarations: [
        UserThumbComponent,
    ],
    providers: [

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
        UserThumbComponent
    ]

})

export class SharedModule {}

