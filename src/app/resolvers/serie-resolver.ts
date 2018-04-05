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
export class SerieResolver implements Resolve <Series> {

    constructor( private seriesService: SeriesService, private router: Router ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <Series> {
        const id = route.params['id'];
        console.log('Series Resolver: id: ' + id);
        // if (isNaN(id)) {
        //    // this.router.navigate(['/welcome']);
        //     return Observable.of(null);
        // }
        if (id === '0') {
            console.log('Creating new Series');
            const newSeries = new Series('', '', '', '', false);
            return Observable.of(newSeries); } else {
        return this.seriesService.getSeries(id).
        map(series => { if (series) {

            console.log(' Resolver got a series. ' + id);
            console.log(JSON.stringify(series[0]));
            return series[0]; }
        this.router.navigate(['/welcome']);
        return null; })
    .catch(error => {
        this.router.navigate(['/welcome']);
        return Observable.of(null);
    });
    }
  }
}
