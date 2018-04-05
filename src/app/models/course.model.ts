import { Section } from './section.model';

export class Course {
  _id?: string;

  constructor (
      public title: string,
      public description: string,
      public id: string,
      public sections: Section[],
      public image: string,
      public remove_this: boolean
  ) {}

}


