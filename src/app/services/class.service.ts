import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { ClassModel } from '../models/class.model';
import { User } from '../models/user.model';
import { Globals } from '../globals';

@Injectable()
export class ClassService implements OnInit {
    // private _registryUrl;
    // private _classesUrl;
    // _studentClassesUrl;
    // _instructorClassesUrl;
    private classCount = 0;
    private highestID = 0;
    classes: ClassModel[];
    errorMessage: string;


    constructor (private _http: HttpClient, private globals: Globals) {
    }

    getClassesNow() {
      this.getClasses().subscribe(
        classes => this.classes = classes,
        error => this.errorMessage = <any>error);
    }
    ngOnInit() {
      this.getClassesNow();
    }

    // Rather than returning an array of class ID's from the memory based class objects,
    // lets call the API and let mongo do the searching, and return to us a list of complete class objects

    getStudentEnrollments( studentID ): Observable <ClassModel[]> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');

     return this._http.get <ClassModel[]> (this.globals.enrollments + '?id=' + studentID, {headers: myHeaders});

    }

    getInstructorAssignments( userID ): Observable <ClassModel[]> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');

     return this._http.get <ClassModel[]> (this.globals.assignments + '?id=' + userID, {headers: myHeaders});

    }

   getClasses(): Observable<ClassModel[]> {
    // console.log('In class service, getClasses.');
     const myHeaders = new HttpHeaders();
     myHeaders.append('Content-Type', 'application/json');

    return this._http.get <ClassModel[]> (this.globals.classes, {headers: myHeaders})
      // debug the flow of data
      .do(data => {// console.log('All: ' + JSON.stringify(data));
      this.classes = data;
      this.classCount = +data.length;

      // Loop through all the Classes to find the highest ID#
      for (let i = 0; i < data.length; i++) {
        const foundID = Number(data[i].id);

        if (foundID >= this.highestID) {
          const newHigh = foundID + 1;
          this.highestID = newHigh;
        }
      }


    } )
      .catch( this.handleError );
  }


  gethighestID(): number {
    this.updateIDCount();
    return this.highestID;
  }

  updateIDCount() {
    // Loop through all the Materials to find the highest ID#
    if (this.classes && this.classes.length > 0) {
    for (let i = 0; i < this.classes.length; i++) {
    const foundID = Number(this.classes[i].id);
    // console.log('Found ID: ' + foundID);
    if (foundID >= this.highestID) {
      const newHigh = foundID + 1;
      this.highestID = newHigh;
      // console.log('newHigh == ' + newHigh);
    }
  } } else {
    this.getClassesNow();
  }
}


  getClassFromMemory(queryID): ClassModel {
    // console.log('In getClassFromMemory method: ' + this.classes);

    if (this.classes) {
      // console.log('looking: ' + this.classes.length);
      for (let i = 0; i < this.classes.length; i++) {

        if (this.classes[i].id === queryID ) {
          return this.classes[i];
        }
      }
    }
    return null;
  }

  getClass(id): Observable <ClassModel> {
    // console.log('In Class Service, this id =' + id);
    const idNumber = parseInt(id, 10);
    if (idNumber > 0 ) {
     // console.log('The ID wasn\'t zero, so we\'re gettin the class from the api.');
    return this._http.get<ClassModel[]> ( this.globals.classes + '?id=' + id )
      .do(data => {

      return data; })
      .catch (this.handleError); } else {
       // console.log('The ID is zero, so we\'re creating a fresh new Class.');
        return Observable.of( new ClassModel('', '', '', '', '', null, null ) );
      }
  }



 createClass(classObject): Observable<ClassModel> {

   // console.log('In createClass method of the Class Service: ' + JSON.stringify(classObject));
    classObject.id = this.gethighestID().toString();
   // console.log('New id =' + classObject.id);
    const myHeaders = new HttpHeaders();
    myHeaders.append('Content-Type', 'application/json');

    const url = this.globals.classes;
    const putString = url + '?id=' + classObject.id;
  //  console.log('Put string: ' + putString);
    return this._http.put(putString, classObject, {headers: myHeaders}).map(
       () => classObject );

  }

  updateClass(classObject: ClassModel): Observable<any> {

    const myHeaders = new HttpHeaders();
    myHeaders.append('Content-Type', 'application/json');

    return this._http.put(this.globals.classes + '?id=' + classObject.id, classObject, {headers: myHeaders});

  }

  deleteClass(classId: number): Observable<any> {
    return this._http.delete( this.globals.classes + '?id=' + classId);
}


    private handleError (error: HttpErrorResponse) {
    //  console.log( error.message );
      return Observable.throw(error.message);

    }


}




