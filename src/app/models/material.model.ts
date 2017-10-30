export class Material {
  _id?: string;

  constructor (
      public title: string,
      public description: string,
      public id: string,
      public contenturl: string,
      public type: string,
      public image: string,
      public file: string,
      public owner: string   // this is the id of the user who uploaded this
  ) {}

}


