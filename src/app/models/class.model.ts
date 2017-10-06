export class ClassModel {
  _id?: string;

  constructor (
      public title: string,
      public description: string,
      public course: string,
      public start: string,
      public end: string,
      public id: string,
      public regUsers: string[]
  ) {}

}


