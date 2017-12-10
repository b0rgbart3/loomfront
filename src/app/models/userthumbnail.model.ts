import { User } from './user.model';

export class Userthumbnail {
  _id?: string;

  constructor (
      public user: User,
      public user_id: string,
      public editable: boolean,
      public inRoom: boolean,
      public size: number,
      public showUsername: boolean,
      public showInfo: boolean,
      public textColor: string

  ) {}

}


