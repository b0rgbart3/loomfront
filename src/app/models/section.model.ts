import { MaterialCollection } from './materialcollection.model';
import { Materialreference } from './materialreference.model';

export class Section {
  _id?: string;

  constructor (
      public title: string,
      public id: string,
      public content: string,
      public materials: Array <Materialreference>,
      public materialCollection: MaterialCollection,
      public sectionNumber: string
  ) {}

}


