import { MaterialCollection } from './materialcollection.model';
import { Materialreference } from './materialreference.model';

export class Section {
  _id?: string;

  constructor (
      public title: string,
      public content: string,
      public materials: string[],
      public materialCollection: MaterialCollection,
      public sectionNumber: number
  ) {}

}


