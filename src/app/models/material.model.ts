export class Material {
  _id?: string;

  constructor (
      public title: string,
      public description: string,
      public id: string,
      public contenturl: string, // this will double as a purchase url?
      public type: string,
      public image: string,
      public imageURL: string,
      public file: string,
      public fileURL: string,
      public content: string,
      public author: string,
      public owner: string   // this is the id of the user who uploaded this
  ) {}

}


