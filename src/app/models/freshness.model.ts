import { MessageReply } from './messagereply.model';

export class Freshness {
    _id?: string;

    constructor (
        public user_id: string,
        public fresh: boolean
    ) {}
  }
