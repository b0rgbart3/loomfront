import { Component, OnInit, Input } from '@angular/core';
import { Book } from '../../../models/book.model';
import { Globals } from '../../../globals';





@Component({
    moduleId: module.id,
    selector: 'book',
    templateUrl: 'book.component.html',
    styleUrls: ['book.component.css']
})

export class BookComponent implements OnInit {
    @Input() book: Book;
    imageURL: string;
constructor( private globals: Globals) {}

ngOnInit() {
  console.log('In book component: book = ' + JSON.stringify(this.book));
  this.imageURL = this.globals.bookimages + '/' + this.book.id + '/' + this.book.image;
}

}

