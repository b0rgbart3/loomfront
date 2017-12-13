import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Globals } from '../globals';

import { Book } from '../models/book.model';
import { MaterialCollection } from '../models/materialcollection.model';


@Injectable()
export class BookService {

    private bookCount = 0;
    private highestID = 0;
    private books: Book[];
    // private _courseSeedUrl = 'http;//localhost:3100/course_seed';

    constructor (private _http: HttpClient, private globals: Globals) {}

    // getAllBooks(): Observable<Book[]> {
    //   return this._http.get <Book[]> (this.globals.books).do(data => {
    //     this.bookCount = data.length;
    //     this.books = data;
    //   }).catch(this.handleError);
    // }

    // We want to get all the material objects for the entire course -- but
    // not all the material objects in the entire database -- so we'll grab
    // them using the corresponding course_id.
   getBooks( course_id ): Observable<Book[]> {
     if (course_id === 0) {
       // get a list of ALL the materials for ALL courses
        return this._http.get <Book[]> (this.globals.books).do(data => {
          this.bookCount = data.length;
          this.books = data;
          this.updateIDCount();
        }).catch(this.handleError);
     } else {
    return this._http.get <Book[]> (this.globals.materials + '?id=' + course_id )
      // debug the flow of data
      .do(data =>  { // console.log('All: ' + JSON.stringify(data));
                    this.bookCount = data.length;
                    this.books = data;
                    this.updateIDCount();
            // console.log("Course highest ID: "+ this.highestID);
                  } )
      .catch( this.handleError ); }
  }

  getNextId() {
    return this.highestID.toString();
  }

  updateIDCount() {
      // Loop through all the Materials to find the highest ID#
      if (this.books && this.books.length > 0) {
      for (let i = 0; i < this.books.length; i++) {
      const foundID = Number(this.books[i].id);
      // console.log('Found ID: ' + foundID);
      if (foundID >= this.highestID) {
        const newHigh = foundID + 1;
        this.highestID = newHigh;
        // console.log('newHigh == ' + newHigh);
      }
    } } else { this.highestID = 1; }
  }


  getBook(id): Observable<Book> {
    return this._http.get<Book> ( this.globals.books + '?id=' + id )
      .do(data => {
         // console.log( 'found: ' + JSON.stringify(data) );
      return data; })
      .catch (this.handleError);
  }

  deleteBook(bookId: number): Observable<any> {
      return this._http.delete( this.globals.books + '?id=' + bookId);
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || {};
  }

  createBook(courseObject: Book): Observable<any> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
      // let thisID = this.courseCount + 1;
      // console.log('highestID: ' + this.highestID);
      if (this.highestID < 1) {
        this.highestID = 1;
      }
      courseObject.id = this.highestID.toString();

      // courseObject.id = '' + thisID;
      const body =  JSON.stringify(courseObject);
      // console.log( 'Posting Course: ', body   );
      return this._http.put(this.globals.books + '?id=' + courseObject.id, courseObject, {headers: myHeaders} );
   }

   updateBook(courseObject: Book): Observable<any> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
      const body =  JSON.stringify(courseObject);
      // console.log( 'Posting Course: ', body   );
      return this._http.put(this.globals.books + '?id=' + courseObject.id, courseObject, {headers: myHeaders} );
   }

    private handleError (error: HttpErrorResponse) {
      // console.log( error.message );
      return Observable.throw(error.message);

    }



}




