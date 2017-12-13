import { Component, OnInit } from '@angular/core';
import { Course } from '../models/course.model';
import { CourseService } from '../courses/course.service';
import { BookService } from '../services/book.service';
import { Book } from '../models/book.model';

@Component ({
    templateUrl: './course-builder.component.html',
    styleUrls: ['./course-builder.component.css']
})

export class CourseBuilderComponent implements OnInit {

courses: Course[];
courseCount: number;
books: Book[];
bookCount: number;
errorMessage: string;

constructor (
private courseService: CourseService,
private bookService: BookService
) {}

ngOnInit() {
  this.getCourses();
  this.getBooks();
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

  // getAllBooks() {
  //   this.bookService
  //   .getBooks().subscribe(
  //     books =>  {this.books = books;
  //     this.bookCount = this.books.length; },
  //     error => this.errorMessage = <any>error);
  //   }
  

}
