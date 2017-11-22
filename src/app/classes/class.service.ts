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
    private _registryUrl;
    private _classesUrl;
    private classCount = 0;
    private highestID = 0;
    classes: ClassModel[];
    errorMessage: string;


    constructor (private _http: HttpClient, private globals: Globals) {
      this._registryUrl = globals.base_path + '/api/classregistrations';
      this._classesUrl = globals.base_path + '/api/classes';
      console.log('Classes API URL: ' + this._classesUrl);
    }

    ngOnInit() {
      this.getClasses().subscribe(
        classes => this.classes = classes,
        error => this.errorMessage = <any>error);

    }


   getClasses(): Observable<ClassModel[]> {
     const myHeaders = new HttpHeaders();
     myHeaders.append('Content-Type', 'application/json');

    return this._http.get <ClassModel[]> (this._classesUrl, {headers: myHeaders})
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
    console.log('In Class Service, this id =' + id);
    const idNumber = parseInt(id, 10);
    if (idNumber > 0 ) {
      console.log('The ID wasn\'t zero, so we\'re gettin the class from the api.');
    return this._http.get<ClassModel[]> ( this._classesUrl + '?id=' + id )
      .do(data => {

      return data; })
      .catch (this.handleError); } else {
        console.log('The ID is zero, so we\'re creating a fresh new Class.');
        return Observable.of( new ClassModel('', '', '', '', '', '', null, null) );
      }
  }

  // This method just takes the classObject and a list of users,
  // and returns an array of full User Objects for this class
  // -- because the classObject stores user info objects - but not
  // user objects.
  getStudents(classObject, users): User[] {
    const students = <User[]> [];
    for (let i = 0; i < classObject.students.length; i++) {
      const student_id = classObject.students[i].user_id;

      if (users) {
      for (let j = 0; j < users.length; j++) {
          if (users[j].id === student_id) {
              students.push(users[j]);
          }
      }}
    }
    return students;
  }

  // Similarly here - we're colleting an array of User objects
  // of the instructors for this class
  getInstructors(classObject, users): User[] {
      const instructors = <User[]> [];
         for (let i = 0; i < classObject.instructors.length; i++) {
            const inst_id = classObject.instructors[i].user_id;

            if (users) { for (let j = 0; j < users.length; j++) {
                if (users[j].id === inst_id) {
                    instructors.push(users[j]);
                }
            }}
        }
        return instructors;
  }

 createClass(classObject): Observable<ClassModel> {

    classObject.id = this.highestID.toString();

    const myHeaders = new HttpHeaders();
    myHeaders.append('Content-Type', 'application/json');

    // Note: I'm not passing the id as part of the url -- because it's inside the classObject
    const url = this._classesUrl;
    return this._http.put(url + '?id=' + classObject.id, classObject, {headers: myHeaders}).map( () => classObject );

  }

  updateClass(classObject: ClassModel): Observable<any> {

    const myHeaders = new HttpHeaders();
    myHeaders.append('Content-Type', 'application/json');

    return this._http.put(this._classesUrl + '?id=' + classObject.id, classObject, {headers: myHeaders});

  }

  deleteClass(classId: number): Observable<any> {
    return this._http.delete( this._classesUrl + '?id=' + classId);
}


    private handleError (error: HttpErrorResponse) {
      console.log( error.message );
      return Observable.throw(error.message);

    }


}




