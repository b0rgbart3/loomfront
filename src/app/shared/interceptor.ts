import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor,
    HttpRequest, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

/**
 * Handle empty JSON responses.
 */
@Injectable()
export class EmptyResponseBodyInterceptor implements HttpInterceptor {
    constructor() {
    }

    /**
     * Intercept request and convert it to text response.
     *
     * BUG: https://github.com/angular/angular/issues/18680
     * As of 2018-01-11 it is closed and reported fixed in Angular 5, however people are still reporting it not working.
     *
     * @param {HttpRequest<any>} req
     * @param {HttpHandler} next
     * @return {Observable<HttpEvent<any>>}
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        /* istanbul ignore next */
        if (req.responseType === 'json') {
            req = req.clone({responseType: 'text'});

            return next.handle(req).map(response => {
                if (response instanceof HttpResponse) {
                    response = response.clone<any>({body: JSON.parse(response.body)});
                }

                return response;
            }).catch((error: any) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.error && error.error.length && error.headers.get('content-type').startsWith('application/json')) {
                        error = new HttpErrorResponse({
                            error: JSON.parse(error.error),
                            headers: error.headers,
                            status: error.status,
                            statusText: error.statusText,
                            url: error.url
                        });
                    }
                }

                return Observable.throw(error);
            });
        }

        return next.handle(req);
    }
}
