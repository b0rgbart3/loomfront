import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { Asset } from '../models/Asset.model';
import { HttpHeaders } from '@angular/common/http';


@Injectable()
export class AssetService {
  isLoggedIn = false;
  private highestID = 0;
  private AssetCount = 0;

  private _AssetsUrl = 'http://localhost:3100/api/assets';

  constructor (private _http: HttpClient) {}


    getAsset( id ): Observable<Asset[]> {

      return this._http.get<Asset[]> ( this._AssetsUrl + '/id:' + id )
      .do(data => {
        console.log( 'found: ' + JSON.stringify(data) );
      return data; })
      .catch (this.handleError);
    }
    getAssets(): Observable<Asset[]> {
      return this._http.get <Asset[]> (this._AssetsUrl)
        // debug the flow of data
        .do(data => {
        if (data) {
        this.AssetCount = data.length; } else { this.AssetCount = 0; }
        // Loop through all the Courses to find the highest ID#
        if (!this.highestID) {
          this.highestID = 0;
        }
        if (data) {
        for (let i = 0; i < data.length; i++) {
          const foundID = Number(data[i].id);
          console.log('Found ID: ' + foundID);
          if (foundID >= this.highestID) {
            const newHigh = foundID + 1;
            this.highestID = newHigh;
          }
          console.log('hightestID: ' + this.highestID );
      } }})
        .catch( this.handleError );
    }

    deleteAsset(AssetId: number): Observable<any> {
      return this._http.delete( this._AssetsUrl + '/id:' + AssetId);
    }

    createAsset(uploadFile: File): Observable<any> {
      console.log('Made it to the createAsset method.');

      const AssetObject = <Asset> {};
      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
      AssetObject.id = this.highestID.toString();
      const body =  JSON.stringify(AssetObject);
      console.log('Highest ID: ' + this.highestID );
      console.log('In createAsset.');

      console.log( 'Creating Asset: ', body   );
      console.log(this._AssetsUrl);

      return this._http.post(this._AssetsUrl + '/upload' , uploadFile, {headers: myHeaders} );
    }

    updateAsset(AssetObject: Asset): Observable<any> {
      console.log('Made it to the updateAsset method.');

      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');

      const body =  JSON.stringify(AssetObject);


      return this._http.post(this._AssetsUrl + '/update' , AssetObject, {headers: myHeaders} );
    }

    private handleError (error: HttpErrorResponse) {
      console.log( error.message );
      return Observable.throw(error.message);
    }



}

