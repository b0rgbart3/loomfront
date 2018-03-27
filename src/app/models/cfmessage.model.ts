import { MessageReply } from './messagereply.model';
import { Freshness } from './freshness.model';

export class CFMessage {
    _id?: string;

    constructor (
        public id: string,
        public firstname: string,
        public lastname: string,
        public message: string,

    ) {}
  }
