export class Image {
  _id?: string;

  constructor (
      public title: string,
      public id: string,
      public image: string,
      public owner: string   // this is the id of the user who uploaded this
  ) {}

}


