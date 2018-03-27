import { Course } from './course.model';

export class ChoiceList {
  _id?: string;

  constructor (
      public headline: string,
      public choices: string[],

  ) {}

}


