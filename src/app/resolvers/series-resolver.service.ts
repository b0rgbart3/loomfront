import { Component, OnInit, Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Series } from '../models/series.model';
import { SeriesService } from '../services/series.service';

@Injectable()
export class SeriesResolver implements Resolve <Series> {

    constructor( private seriesService: SeriesService, private router: Router ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <any> {
        return this.seriesService.getSeries(0).
        map(series => { if (series) {
            return series; }
        return null; })
    .catch(error => {
        return Observable.of(null);
    });

  }
}
