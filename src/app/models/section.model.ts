import { MaterialCollection } from './materialcollection.model';

export class Section {
  _id?: string;

  constructor (
      public title: string,
      public id: string,
      public content: string,
      public materials: Array <Object>,
     // public materialCollection: MaterialCollection, 
      public books: Array <Object>,
      public sectionNumber: number
  ) {}

}


