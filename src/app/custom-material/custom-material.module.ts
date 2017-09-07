import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule } from '@angular/material';
import { MdButtonModule, MdCheckboxModule, MdDatepickerModule, MdNativeDateModule } from '@angular/material';

@NgModule({
  imports: [BrowserAnimationsModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdButtonModule,
    MdCheckboxModule, MdDatepickerModule, MdNativeDateModule],
  exports: [BrowserAnimationsModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdButtonModule,
    MdCheckboxModule, MdDatepickerModule, MdNativeDateModule],
})
export class CustomMaterialModule { }
