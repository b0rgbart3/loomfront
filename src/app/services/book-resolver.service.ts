import { Component, OnInit, Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Book } from '../models/book.model';
import { BookService } from './book.service';

@Injectable()
export class BookResolver implements Resolve <Book> {

    constructor( private bookService: BookService,  private router: Router ) { }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <Book> {
        const id = route.params['id'];

        if (isNaN(id)) {
            this.router.navigate(['/welcome']);
            return Observable.of(null);
        }
        if (id === 0) {
            return Observable.of(null);
        }
        console.log('In Book Resolver: id=' + id);
        return this.bookService.getBook(id).
        map(book => { if (book) {
            return book; }
        this.router.navigate(['/welcome']);
        return null; })
    .catch(error => {
        this.router.navigate(['/welcome']);
        return Observable.of(null);
    });
    }
}
