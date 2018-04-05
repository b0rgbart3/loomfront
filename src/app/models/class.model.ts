import { Course } from './course.model';

export class ClassModel {
  _id?: string;

  constructor (
      public title: string,
      public course: string,
      public start: Date,
      public end: Date,
      public id: string,
      public cost: string,
      // public instructors: Instructor[],
      // public students: Student[],
      public courseObject: Course,
      public courseImageURL: string,
      public costBlurb: string,
      public remove_this: boolean

  ) {}

}


