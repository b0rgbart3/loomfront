import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { User } from '../models/user.model';
import 'rxjs/Rx';  // Reactive Extensions for Javascript
import { Observable } from 'rxjs/Observable';

@Injectable()

export class FormPoster {
    constructor ( private http: Http){ }

    private extractData(res: Response) {
        let body = res.json();
        return body.fields || {};
    }

    private extractLanguages(res: Response) {
        let body = res.json();
        return body.data || {};
    }


    private handleError(error: any) {
        console.error('post error: ', error);
        return Observable.throw(error.statusText);
    }

    postUserRegistration(postingUser: User): Observable<any>
    {
        let body = JSON.stringify(postingUser);
        let headers = new Headers( { 'Content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });


        console.log( 'Posting User: ', postingUser );

        return this.http.post('http://localhost:8182/postuser', body, options)
        .map(this.extractData)
        .catch(this.handleError);


    }

    getLanguages(): Observable<any> {
        return this.http.get('http://localhost:3100/get-languages')
            .delay(1200)
            .map(this.extractLanguages)
            .catch(this.handleError);
    }

    postEmployeeForm(employee: User ): Observable<any> {
        let body = JSON.stringify(employee);
        let headers = new Headers( { 'Content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        // This is returning an Observable Object -- which will only get sent to Subscribers

        return this.http.post('http://localhost:3100/postemployee', body, options)
        .map(this.extractData)
        .catch(this.handleError);

    }
}