import { Component, OnInit, Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Material } from '../models/material.model';
import { MaterialService } from '../services/material.service';

@Injectable()
export class BookResolver implements Resolve <Material> {

    constructor( private materialService: MaterialService,  private router: Router ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <Material> {
        const id = route.params['id'];

        if (isNaN(id)) {
            this.router.navigate(['/welcome']);
            return Observable.of(null);
        }
        if (id === 0) {
            return Observable.of(null);
        }
        console.log('In Book Resolver: id=' + id);
        return this.materialService.getMaterial(id).
        map(material => { if (material) {
            return material; }
        this.router.navigate(['/welcome']);
        return null; })
    .catch(error => {
        this.router.navigate(['/welcome']);
        return Observable.of(null);
    });
    }
}
