import { Component, OnInit } from '@angular/core';
import { ClassModel } from '../../models/class.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from '../class.service';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
    moduleId: module.id,
    templateUrl: 'class-edit.component.html',
    styleUrls: ['class-edit.component.css']
})

export class ClassEditComponent implements OnInit {

    classForm: FormGroup;
    thisClass: ClassModel;
    id: string;
    errorMessage: string;

    constructor( private activated_route: ActivatedRoute, private classService: ClassService, private router: Router ) {   }

    ngOnInit(): void {
        this.thisClass = new ClassModel( '', '', '', '', '', '' );
        const id = +this.activated_route.snapshot.params['id'];

        if (id !== 0) {
            console.log('In the edit component, id was not zero: ' + id);

            this.getClass(id);
         }

         this.classForm = new FormGroup( {
            title: new FormControl(),
            description: new FormControl(),
            // I don't actually think I need a form control for the course id
           // course_id: new FormControl(this.thisCla)
         } );

    }

    getClass(id: number) {
        this.classService.getClass(id).subscribe(
            classobject => {this.thisClass = <ClassModel>classobject[0]; console.log('got class info :' +
                            JSON.stringify(classobject) );
                            console.log('Getting the class Object: ' + JSON.stringify( this.thisClass ) );
                            this.populateForm();
                         },
            error => this.errorMessage = <any> error
        );
    }


    populateForm(): void {
        console.log('In populate: ' + JSON.stringify(this.thisClass) );
        this.classForm.setValue({
            title: this.thisClass.title,
            description: this.thisClass.description
        });
    }

    save(): void {
        console.log('In Class-Edit component, about to savemodel');
        if (this.classForm.dirty && this.classForm.valid) {

            // This is Deborah Korata's way of merging our data model with the form model
            const combinedClassObject = Object.assign( {}, this.thisClass, this.classForm.value);
            console.log('In Class-Edit component, saving model');
            if (this.thisClass.id === '0') {
                this.classService.createClass( combinedClassObject ).subscribe(
                    (val) => {
                        console.log('POST call successful value returned in body ', val);
                      },
                      response => {
                        console.log('POST call in error', response);
                      },
                      () => {
                        console.log('The POST observable is now completed.');
                      //   this.alertService.success('Thank you for registering with the Reclaiming Loom. ' +
                      //   ' Now, please check your email, and use the verification code to verify your account.  Thank you.', true);
                      //   // this._flashMessagesService.show('Username or password was incorrect.',
                        // { cssClass: 'alert-warning', timeout: 7000 });
                        this.router.navigate(['/admin']);
                      }
                );
            } else {
                // Validate stuff here
                console.log('About to update class.');
                this.classService
                .updateClass( combinedClassObject ).subscribe(
                (val) => {
                console.log('POST call successful value returned in body ', val);
                },
                response => {
                console.log('POST call in error', response);
                },
                () => {
                console.log('The POST observable is now completed.');
                //   this.alertService.success('Thank you for registering with the Reclaiming Loom. ' +
                //   ' Now, please check your email, and use the verification code to verify your account.  Thank you.', true);
                //   // this._flashMessagesService.show('Username or password was incorrect.',
                // { cssClass: 'alert-warning', timeout: 7000 });
                this.router.navigate(['/admin']);
                });
            }
        }
    }



    onSaveComplete(): void {
        this.classForm.reset();
        this.router.navigate(['/admin']);
    }
}

