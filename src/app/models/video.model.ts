export class Video {
  _id?: string;

  constructor (
      public title: string,
      public description: string,
      public id: string,
      public url: string,
      public image: string,
      public owner: string   // this is the id of the user who uploaded this
  ) {}

}


