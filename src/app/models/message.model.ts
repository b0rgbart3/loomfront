export class Message {
    _id?: string;

    constructor (
        public message: string,
        public  user_id:    string
    ) {}
  }
