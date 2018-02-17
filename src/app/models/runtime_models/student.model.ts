export class Student {
  _id?: string;

  constructor (
      public user_id: string,
      public status: any[],
      public sections_completed: any[],
      public materials_completed: any[]
  ) {}

}


