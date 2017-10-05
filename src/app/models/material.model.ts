export class Material {
  _id?: string;

  constructor (
      public title: string,
      public id: string,
      public url: string,
      public type: string,
      public image: string,
      public course_id: string,
      public section_id: string,
      public owner: string   // this is the id of the user who uploaded this
  ) {}

}


