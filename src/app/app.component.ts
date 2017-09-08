import {Component} from '@angular/core';
import {Http} from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

//   private version: any;
//   constructor(http: Http) {
//       // Display the currently used Material 2 version.
//       this.version = http
//         .get('https://api.github.com/repos/angular/material2-builds/commits/HEAD')
//         .map(res => res.json());
//     }
}

