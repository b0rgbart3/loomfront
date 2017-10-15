import { Component, OnInit, Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ContentChart } from '../models/contentchart.model';
import { ClassService } from '../classes/class.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { MaterialService } from '../materials/material.service';

@Injectable()
export class MaterialsResolver implements Resolve <Course> {

    constructor( private materialService: MaterialService, private router: Router ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <Course> {
        const id = route.params['id'];

        if (isNaN(id)) {
            console.log(`Course id was not a number: ${id}`);
            this.router.navigate(['/welcome']);
            return Observable.of(null);
        }
        return this.materialService.getMaterials(id).
        map(course => { if (course) { return course; }
        console.log(`Materialswere not found: ${id}`);
        this.router.navigate(['/welcome']);
        return null; })
    .catch(error => {
        console.log(`Retrieval error: ${error}`);
        this.router.navigate(['/welcome']);
        return Observable.of(null);
    });
    }
}
