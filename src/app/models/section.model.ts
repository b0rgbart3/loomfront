export class Section {
  _id?: string;

  constructor (
      public title: string,
      public id: string,
      public content: string,
      public materials: Array <number>,
  ) {}

}


