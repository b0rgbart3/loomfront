import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin/admin.component';
import { AdminRouteActivator } from './admin/admin-route-activator';

@NgModule ( {
    imports: [
        SharedModule,
        RouterModule.forChild([
            { path: 'admin', component: AdminComponent }
        ])
    ],
    declarations: [
       AdminComponent,
    ],
    providers: [
        AdminRouteActivator,
    ]
})

export class AdminFeatureModule { }

