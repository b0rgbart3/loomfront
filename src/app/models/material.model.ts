export class Material {
  _id?: string;

  constructor (
      public title: string,
      public description: string,
      public id: string,
      public type: string,
      public image: string,
      public file: string,
      public content: string,
      public contenturl: string, // this will double as a purchase url?
      public author: string,
      public length: string, // time based for audio and video -- or # of pages for documents
      public owner: string,   // this is the id of the user who uploaded this
      public remove_this: boolean
  ) {}

}


