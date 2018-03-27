import { User } from './user.model';

export class Userthumbnail {
  _id?: string;

  constructor (
      public user: User,
      public user_id: string,
      public online: boolean,  // This is not implemented yet
      public size: number,
      public showUsername: boolean,
      public showInfo: boolean,
      public textColor: string,
      public border: boolean,
      public shape: string,

  ) {}

}


