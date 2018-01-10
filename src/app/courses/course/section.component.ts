import { Component, OnInit, Output, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../models/course.model';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../models/material.model';
import { Section } from '../../models/section.model';
import { MaterialCollection } from '../../models/materialcollection.model';
import { Book } from '../../models/book.model';
import { Doc } from '../../models/doc.model';




@Component({
    moduleId: module.id,
    selector: 'section',
    templateUrl: 'section.component.html',
    styleUrls: ['section.component.css']
})

export class SectionComponent implements OnInit, OnChanges {
    private _course: Course;
    private _section: Section;
    materialCollection: MaterialCollection;
    title: string;
    content: string;
    // booksLoaded: boolean;
    // loadedBooks: any[];


    @Input() course: Course;
    // set course(course: Course) {
    //     this._course = course;
    //     console.log('course Updated');
    //   }

    // get course(): Course { return this.course; }

    @Input() section: Section;
    // set section(section: Section) {
    //     this._section = section;
    //     this.title = this._section.title;
    //     this.content = this._section.content;
    //     console.log('section updated');
    // }

    // get section(): Section { return this.section; }


    public materials: Material [];
    public books: Material [];
    public docs: Material [];
    errorMessage: string;

   // public materialRefs: Object [];
   // public section: Section;
    // public title: string;
    // public content: string;
    // public description: string;

    constructor (private materialService: MaterialService ) {}


    ngOnInit() {
        this.materialCollection = null;
        // this.title = this.course.title;
        // this.description = this.course.description;
        // console.log('sectionNumber: ' + this.section);
        // this.section = this.course.sections[this.sectionNumber];
        // this.materialRefs = this.section.materials;
        this.loadInMaterials();
        // this.booksLoaded = false;
        // this.loadedBooks = null;
        // this.loadedBooks = [];
        // this.loadInBooks();
//        this.reLintContent();
    }

        // reLintContent() {
        // if (this.course.sections && this.course.sections.length > 0) {
        //  for (let lcSection = 0; lcSection < this.course.sections.length; lcSection++) {
        //       const sc = this.course.sections[lcSection].content;
        //       const editedSC = sc.replace(/<br>/g, '\n');
        //       console.log('Looking at: ' + sc );
        //       this.course.sections[lcSection].content = editedSC;
        //  } }

   // }

    ngOnChanges() {
        this.materialCollection = null;
        // console.log('changes');
     //   this.loadedBooks = null;
        // this.getBooks();
        // this.getDocs();

        this.loadInMaterials();
       // this.loadInBooks();
     }

     // loadInBooks() {
        //  console.log('LOADING IN BOOKS');
        //  this.loadedBooks = null;
        //  this.loadedBooks = [];
        //  if (this.section.books) {

        //      this.section.books.map((bookItem) => {
        //         this.bookService.getBook(bookItem['book']).subscribe(
        //           (book) => {
        //               console.log('Loaded book: ' + JSON.stringify(book));
        //               this.loadedBooks.push(book[0]);
        //             return; },
        //           error => { console.log('Error loading in book: ' + bookItem['book']);
        //       return; }
        //       );
        //      });
        //  }

     //    console.log('BOOKS: ' + JSON.stringify(this.loadedBooks));

   //  }


    loadInMaterials() {

            this.materials = [];
            this.materialCollection = null;
           // console.log('loading in materials for course# ' +
            // this.course.id + ', section: ' + JSON.stringify(this.section));
            if (this.section.materials) {
               // console.log('material count: ' + this.section.materials.length);

            for (let j = 0; j < this.section.materials.length; j++) {

                if (this.section.materials[j]) {
                const id = this.section.materials[j]['material'];


                this.materialService.getMaterial(id).subscribe(
                    (material) => {
                       // console.log('found a material ' + id);

                    if (this.materials.length < this.section.materials.length) {
                        this.materials.push(material[0]); }

                    if (this.materials.length === this.section.materials.length) {
                        // if these are equal, that means we've loaded in all the material objects
                        // so now we can sort them.
                      //  console.log('this.materials length: ' + this.materials.length);
                
                      //    const sortedMaterials = this.materialService.sortMaterials(this.materials);
                    //     this.materialCollection = sortedMaterials;
                
                    // console.log('Sorted books Length' + sortedMaterials.books.length);
                      // console.log('Done sorting the materials');
                     //  console.log(JSON.stringify(this.materialCollection.books));
                      //  console.log(this.materialCollection.books.length);
                    }

                }

                );
              }
            }

       }
    }

}

