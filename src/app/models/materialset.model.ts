import { Course } from './course.model';
import { Material } from './material.model';

export class MaterialSet {
  _id?: string;

  constructor (
      public group: boolean,
      public type: string,
      public materials: Material[]

  ) {}

}


