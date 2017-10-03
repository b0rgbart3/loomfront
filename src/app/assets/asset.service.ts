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
       
          if (foundID >= this.highestID) {
            const newHigh = foundID + 1;
            this.highestID = newHigh;
          }
         
      } }})
        .catch( this.handleError );
    }

    deleteAsset(AssetId: number): Observable<any> {
      return this._http.delete( this._AssetsUrl + '/id:' + AssetId);
    }

    createAsset( AssetObject: any): Observable<any> {
      

      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');
      AssetObject.id = this.highestID.toString();
      const body =  JSON.stringify(AssetObject);
    



      return this._http.post(this._AssetsUrl, AssetObject, {headers: myHeaders} );
    }

    updateAsset(AssetObject: Asset): Observable<any> {
   

      const myHeaders = new HttpHeaders();
      myHeaders.append('Content-Type', 'application/json');

      const body =  JSON.stringify(AssetObject);


      return this._http.post(this._AssetsUrl + '/update' , AssetObject, {headers: myHeaders} );
    }

    private handleError (error: HttpErrorResponse) {
    
      return Observable.throw(error.message);
    }



}

