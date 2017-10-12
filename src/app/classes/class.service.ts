import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { ClassModel } from '../models/class.model';
import { Classregistrationgroup } from '../models/classregistrationgroup.model';

@Injectable()
export class ClassService implements OnInit {
    private _registryUrl = 'http://localhost:3100/api/classregistrations';
    private _classesUrl = 'http://localhost:3100/api/classes';
    private classCount = 0;
    private highestID = 0;
    classes: ClassModel[];
    errorMessage: string;
    classregistrations: Classregistrationgroup[];
   

    constructor (private _http: HttpClient) {}

    ngOnInit() {
      this.getClasses().subscribe(
        classes => this.classes = classes,
        error => this.errorMessage = <any>error);

     this.getClassRegistrations().subscribe(
          classregistrations => this.classregistrations = classregistrations,
          error => this.errorMessage = <any>error);
    }

    getClassRegistrations(): Observable <Classregistrationgroup[]> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');

     return this._http.get <Classregistrationgroup[]> (this._registryUrl, {headers: myHeaders})
       // debug the flow of data
       .do(data => {
        // console.log('All: ' + JSON.stringify(data));
       this.classregistrations = data;
     } )
       .catch( this.handleError );
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

  getClass(id): Observable<ClassModel[]> {
    return this._http.get<ClassModel[]> ( this._classesUrl + '?id=' + id )
      .do(data => {

      return data; })
      .catch (this.handleError);
  }

 createClass(classObject): Observable<ClassModel> {

    classObject.id = this.highestID.toString();

    const myHeaders = new HttpHeaders();
    myHeaders.append('Content-Type', 'application/json');

    // Note: I'm not passing the id as part of the url -- because it's inside the classObject
    const url = this._classesUrl;
    return this._http.put(url + '?id=' + classObject.id, classObject, {headers: myHeaders}).map( () => classObject );

  }

  // // Note the class ID should match the classreggroup id

  getClassRegistry ( classID ): Observable<any> {
    const myHeaders = new HttpHeaders();
    myHeaders.append('Content-Type', 'application/json');

    return this._http.get<Classregistrationgroup> ( this._registryUrl + '?id=' + classID )
    .do(data => data )
    .catch ( this.handleError );

  }

  saveRegistry ( regObject ): Observable<any> {
    const myHeaders = new HttpHeaders();
    myHeaders.append('Content-Type', 'application/json');

   // console.log('Saving Reg Object: ' + JSON.stringify ( regObject) );


    return this._http.put(this._registryUrl + '?id=' + regObject.id, regObject, {headers: myHeaders});

  }

  // return an array of class ids that this particular user is registered for as a student
  getRegClassIds( queryID ) {
    const classIDs = <string []>[];
    if (this.classregistrations ) {
      // console.log('Class registrations: ' + JSON.stringify( this.classregistrations ));
    } else {
      // console.log(' No class registrations' );
      this.getClassRegistrations().subscribe(
        classregistrations => this.classregistrations = classregistrations,
        error => this.errorMessage = <any>error);
    }

    if (this.classes) {
      for (let i = 0; i < this.classes.length; i++) {
        const regGroup = this.classregistrations[i];
        if (regGroup.id === this.classes[i].id) {
          // we found the reg for this class object
          const regs = regGroup.regs;
          for (let j = 0; j < regs.length; j++) {
            if (regs[j].userid === queryID ) {
              // found a registration for this user, so let's push this class object
              classIDs.push(regGroup.id.toString());
            }
          }
        }
      }
      return classIDs;
    } else {
      return null;
    }
  }

  getInstructorClassIds( queryID ) {
    const classIDs = <string []>[];

    if (this.classregistrations) {
      for (let i = 0; i < this.classes.length; i++) {
        const regGroup = this.classregistrations[i];
        if (regGroup.id === this.classes[i].id) {
          // we found the reg for this class object
          const instructors = regGroup.instructors;
          for (let j = 0; j < instructors.length; j++) {
            if (instructors[j].userid === queryID ) {
              // found a registration for this user, so let's push this class object
              classIDs.push(regGroup.id.toString());
            }
          }
        }
      }
      return classIDs;
    }
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




