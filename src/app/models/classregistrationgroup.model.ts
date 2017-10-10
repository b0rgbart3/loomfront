import { Classregistration } from './classregistration.model';

export class Classregistrationgroup {
  _id?: string;

  constructor (
      public id: string,
      public instructors: Classregistration [],
      public regs: Classregistration [],

  ) {}

}


