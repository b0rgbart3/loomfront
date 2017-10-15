import { Material } from './material.model';

// This chart includes all the info from a given section - plus the material info added in,
// as full material objects -- rather than just references (as it is in the database)

export class ContentChart {
  _id?: string;

  constructor (
    public course_id: string,
    public title: string,
    public id: string,
    public content: string,
    public materials: Material[],


  ) {}

}


