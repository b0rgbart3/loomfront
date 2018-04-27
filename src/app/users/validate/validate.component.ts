import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ValidateComponent implements OnInit {

  validationCode: string;
  constructor( private activated_route: ActivatedRoute) { }

  ngOnInit() {
    this.validationCode = this.activated_route.snapshot.params['vcode'];
  }

}
