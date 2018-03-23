import { MessageReply } from './messagereply.model';
import { Freshness } from './freshness.model';

export class Message {
    _id?: string;

    constructor (
        public id: string,
        public users: string[],
        public freshness: Freshness[],
        public msgList: MessageReply[]
    ) {}
  }
