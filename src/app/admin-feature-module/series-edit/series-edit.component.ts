import { Component, OnInit } from '@angular/core';
import { ClassModel } from '../../models/class.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from '../../services/class.service';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SeriesService } from '../../services/series.service';
import { Series } from '../../models/series.model';
import _ from 'lodash';
import {Location} from '@angular/common';

@Component({
    moduleId: module.id,
    templateUrl: 'series-edit.component.html',
    styleUrls: ['series-edit.component.css']
})

export class SeriesEditComponent implements OnInit {

   seriesForm: FormGroup;
   series: Series;

    constructor( private activated_route: ActivatedRoute,
        private seriesService: SeriesService,
         private fb: FormBuilder,
        private router: Router,
        private _location: Location ) {

    }

    ngOnInit() {
        const id = this.activated_route.snapshot.params['id'];

       console.log('The ID for this new series is: ' + id);

        if (id !== '0') {
          this.series = this.activated_route.snapshot.data['series'];
        } else {
            this.series = new Series ( '', '', '0', null, false );
        }
        this.seriesForm = this.fb.group( {
            title: null,
            description: null,
        });
       // console.log('Got into the Series Edit Component.');

        this.populateForm();
    }

    populateForm() {
        if (this.series) {
         //   console.log('In Series edit component - about to patch Values to the form: ' + JSON.stringify(this.series));
        this.seriesForm.patchValue({'title': this.series.title,
            'description' : this.series.description });
        } else {
            console.log('in Series Edit -- no series object!');
        }

    }
    closer() {
        this._location.back();
    }

    remove() {
        this.seriesService.remove( this.series ).subscribe( (val) => {
            this.router.navigate(['/admin/classes']);
        }, response => { this.router.navigate(['/admin/classes']); },
            () => { this.router.navigate(['/admin/classes']); });

    }

    save() {
       // console.log('In Class-Edit component, about to savemodel: ' + JSON.stringify(this.seriesForm.value)  );
        if (this.seriesForm.dirty && this.seriesForm.valid) {


            // This is Deborah Korata's way of merging our data model with the form model
             const combinedClassObject = Object.assign( {}, this.series, this.seriesForm.value);



             // This sends the newly formed class Object to the API
             const id_as_number = parseInt(this.series.id, 10);

             if ( id_as_number > 0 ) {
             //    console.log('calling update: ');
                 this.seriesService
                 .updateSeries( combinedClassObject ).subscribe(
                 (val) => {
                  this.router.navigate(['/admin/classes']);
             }, response => { this.router.navigate(['/admin/classes']); },
                 () => { });
 
             } else {
            //     console.log('calling createClass');
                 this.seriesService.createSeries( combinedClassObject ).subscribe(
                     (val) => { }, (response) => {  }
                     ,
                       () => { this.router.navigate(['/admin/classes']); });
             }

        }
    }
}
