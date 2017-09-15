
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { StudentHomepageComponent } from './student-homepage.component';
import { NavBarComponent } from '../navbar/nav-bar.component';

@NgModule({
  // External
  imports: [
    RouterModule.forChild([
      { path: 'home', pathMatch: 'full', component: StudentHomepageComponent },
      { path: '', component: StudentHomepageComponent }
    ]),
  ],
  // Internal
  declarations: [
    StudentHomepageComponent
  ],

  providers: [
   ],
  bootstrap: [StudentHomepageComponent]
})
export class StudentModule { }
