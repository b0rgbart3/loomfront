import { Instructor } from './instructor.model';
import { Student } from './student.model';
import { Course } from './course.model';

export class ClassModel {
  _id?: string;

  constructor (
      public title: string,
      public course: string,
      public start: string,
      public end: string,
      public id: string,
      public instructors: Instructor[],
      public students: Student[],
      public courseObject: Course,
      public courseImageURL: string

  ) {}

}


