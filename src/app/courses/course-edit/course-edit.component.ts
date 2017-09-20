import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../course.service';
import { NgForm } from '@angular/forms';

@Component({
    moduleId: module.id,
    templateUrl: 'course-edit.component.html',
    styleUrls: ['course-edit.component.css']
})

export class CourseEditComponent implements OnInit {

    course: Course;
    id: string;
    errorMessage: string;

    constructor(private router: Router, private activated_route: ActivatedRoute,
        private courseService: CourseService  ) { }

    ngOnInit () {
        this.course = new Course( '', '', '0' );
        const id = +this.activated_route.snapshot.params['id'];
        console.log('MyID: ' + id);

        if (id !== 0) {
            this.getCourse(id);
         }
    }

    getCourse(id: number) {
        this.courseService.getCourse(id).subscribe(
            course => {this.course = <Course>course[0]; console.log('got course info :' + JSON.stringify(course) ); },
            error => this.errorMessage = <any> error
        );
    }

    postCourse(form: NgForm) {
        // console.log(this.course);

        if (this.course.id === '0') {
            this.courseService.createCourse( this.course ).subscribe(
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
            this.courseService
            .updateCourse( this.course ).subscribe(
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
        }
    }
}
