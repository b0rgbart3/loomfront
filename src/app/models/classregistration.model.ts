export class Classregistration {
  _id?: string;

  constructor (
      public userid: string,
      public creationdate: string,
      public role: string[],
      public status: string[]

  ) {}

}


