export class MessageReply {
    _id?: string;

    constructor (
        public user_id: string,
        public message: string
    ) {}
  }
