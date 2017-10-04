export class Course {
  _id?: string;

  constructor (
      public title: string,
      public description: string,
      public id: string,
      public sections: Array <Object>,
      public image: string
  ) {}

}


