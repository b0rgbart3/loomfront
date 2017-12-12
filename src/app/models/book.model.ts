export class Book {
  _id?: string;

  constructor (
      public title: string,
      public description: string,
      public author: string,
      public id: string,
      public purchaseURL: string,
      public image: string,
      public imageURL: string,
      public owner: string   // this is the id of the user who uploaded this
  ) {}

}


