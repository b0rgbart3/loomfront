import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseService } from '../../courses/course.service';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { Doc } from '../../models/doc.model';
import { DocService } from '../../services/doc.service';

@Component ({
    templateUrl: './course-builder.component.html',
    styleUrls: ['./course-builder.component.css']
})

export class CourseBuilderComponent implements OnInit {

courses: Course[];
courseCount: number;
books: Book[];
docs: Doc[];
bookCount: number;
errorMessage: string;

constructor (
private courseService: CourseService,
private bookService: BookService,
private docService: DocService
) {}

ngOnInit() {
  this.getCourses();
  this.getBooks();
  this.getDocs();
}

getCourses() {
    this.courseService
    .getCourses().subscribe(
      courses =>  {this.courses = courses;
      this.courseCount = this.courses.length; },
      error => this.errorMessage = <any>error);
    }

    getBooks() {
      this.bookService.getBooks(0).subscribe(
        books => this.books = books,
        error => this.errorMessage = <any>error);
    }

    getDocs() {
      this.docService.getDocs(0).subscribe(
        docs => this.docs = docs,
        error => this.errorMessage = <any>error);
    }
  // getAllBooks() {
  //   this.bookService
  //   .getBooks().subscribe(
  //     books =>  {this.books = books;
  //     this.bookCount = this.books.length; },
  //     error => this.errorMessage = <any>error);
  //   }


}
