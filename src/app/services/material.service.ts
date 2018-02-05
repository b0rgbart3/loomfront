import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Globals } from '../globals';

import { Material } from '../models/material.model';
import { MaterialCollection } from '../models/materialcollection.model';


@Injectable()
export class MaterialService {

    materialCount = 0;
    highestID = 0;
    materials: Material[];
    material: Material;
    errorMessage: string;
    bookArray: Material[];
    docArray: Material[];
    allMaterialsByType: Material[][];

    // private _courseSeedUrl = 'http;//localhost:3100/course_seed';

    constructor (private _http: HttpClient, private globals: Globals) {}

    getAllMaterialsByType (): Observable<any> {

       return this._http.get <Material[][]>
              (this.globals.allmaterialsbytype).do(data => {
                this.allMaterialsByType = data;
        }).catch(this.handleError);

    }
    getDynamicMaterials( id, type ): Observable<any> {
      if (id === 0) {
        // get all the objects for this type
      //  console.log('\nIn material service / getDM: ' + type + '\n');
        return this._http.get <Material[]>
              (this.globals.materials + '?type=' + type).do(data => {
              //  console.log( type + ': ' + JSON.stringify( data ) + '\n');
                // this.materialCount = data.length;
                  // this.materials = data;
                  // this.updateIDCount();
        }).catch(this.handleError);
      } else {
        // pass back a single object of this type
        return this._http.get <Material>
              (this.globals.materials + '?id=' + id + '&type=' + type).do(data => {
          // keeping a local copy of the data object
          // -- though I don't think we do anything with it
          this.material = data; }).catch( this.handleError );
        }

    }

    getBatchMaterials( list ): Observable<any> {

      const queryString = '?materials=';
      const serialized = list.toString();
     //  console.log('In Material Service, getting Batch Materials, serialized =' + serialized);
      return this._http.get <any> ( this.globals.batchmaterials + queryString + serialized ).do (
        data => {
          return data;
        }).catch(this.handleError);

    }
    // We want to get all the material objects for the entire course -- but
    // not all the material objects in the entire database -- so we'll grab
    // them using the corresponding course_id.
   getMaterials( course_id ): Observable<any> {
     if (course_id === 0) {
       // get a list of ALL the materials for ALL courses
       // console.log('sending get request for materials');
        return this._http.get <Material[]> (this.globals.materials).do(data => {
          this.materialCount = data.length;
          this.materials = data;
          this.updateIDCount();
        }).catch(this.handleError);
     } else {
    return this._http.get <Material[]> (this.globals.materials + '?id=' + course_id )
      // debug the flow of data
      .do(data =>  { // console.log('All: ' + JSON.stringify(data));
                    this.materialCount = data.length;
                    this.materials = data;
                    this.updateIDCount();
            // console.log("Course highest ID: "+ this.highestID);
                  } )
      .catch( this.handleError );
     }

  }


  getNextId() {

        this.updateIDCount();
        return this.highestID.toString();

  }




  updateIDCount() {
      // Loop through all the Materials to find the highest ID#
      if (this.materials && this.materials.length > 0) {
      for (let i = 0; i < this.materials.length; i++) {
      const foundID = Number(this.materials[i].id);
      // console.log('Found ID: ' + foundID);
      if (foundID >= this.highestID) {
        const newHigh = foundID + 1;
        this.highestID = newHigh;
        // console.log('newHigh == ' + newHigh);
      }
    } } else { this.highestID = 1; }
  }


  getMaterial(id): Observable<any> {
    return this._http.get<Material> ( this.globals.materials + '?id=' + id )
      .do(data => {
         // console.log( 'found: ' + JSON.stringify(data) );
      return data; })
      .catch (this.handleError);
  }

  deleteMaterial(id: string): Observable<any> {
      return this._http.delete( this.globals.materials + '?id=' + id);
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || {};
  }

  createMaterial(courseObject: Material): Observable<any> {
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
      return this._http.put(this.globals.materials + '?id=' +
       courseObject.id, courseObject, {headers: myHeaders} );
   }

   updateMaterial(courseObject: Material): Observable<any> {
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
      const body =  JSON.stringify(courseObject);
      // console.log( 'Posting Course: ', body   );
      return this._http.put(this.globals.materials + '?id=' +
       courseObject.id, courseObject, {headers: myHeaders} );
   }

    private handleError (error: HttpErrorResponse) {
      // console.log( error.message );
      return Observable.of(error.message);

    }

    sortMaterials( materialsArray ) {

      const videos = [];
      const docs = [];
      const books = [];
      const audios = [];
      const quotes = [];
      const blocks = [];
      const images = [];

      for (let i = 0; i < materialsArray.length; i++) {

        if (materialsArray[i]) {
         // console.log('through the loop: ' + i);
          switch (materialsArray[i].type) {
            case 'video':
              videos.push(materialsArray[i]);
              break;
            case 'image':
              materialsArray[i].imageURL = this.globals.materialimages + '/' + materialsArray[i].id + '/' + materialsArray[i].image;
            //  console.log('Processing image: ' + JSON.stringify( materialsArray[i] ) );
              images.push(materialsArray[i]);
              break;
            case 'book':
              books.push(materialsArray[i]);
              // console.log(materialsArray[i]);
              // console.log('Found a book: ' + i);
              break;
            case 'doc':
              materialsArray[i].imageURL = this.globals.materialimages + '/' + materialsArray[i].id + '/' + materialsArray[i].image;
              materialsArray[i].fileURL = this.globals.materialfiles + '/' + materialsArray[i].id + '/' + materialsArray[i].file;
              docs.push(materialsArray[i]);
              break;
            case 'audio':
              audios.push(materialsArray[i]);
              break;
            case 'quote':
              // console.log('found a quote.');
              quotes.push(materialsArray[i]);
              break;
            case 'block':
              blocks.push(materialsArray[i]);
              break;
            default:
              break;
          }
        }
        // if (materialsArray[i]) {
        // if (materialsArray[i].type === 'video') {
        //   videos.push(materialsArray[i]);
        // } else {
        //   if (materialsArray[i].type === 'book') {
        //     books.push(materialsArray[i]);
        //   }  else {
        //     if (materialsArray[i].type === 'doc') {
        //       docs.push(materialsArray[i]);
        //     }
        //   }
        // }
//      }
      }

      const sortedMaterials = new MaterialCollection(images, videos, docs, books, audios, blocks, quotes);
      // console.log('quotes: ' + JSON.stringify(quotes));
      // console.log('Sorted Mats: ' + JSON.stringify(sortedMaterials.quotes));
      return sortedMaterials;

    }


}




