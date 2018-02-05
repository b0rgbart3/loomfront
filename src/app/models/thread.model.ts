import { Reply } from './reply.model';

export class Thread {
    _id?: string;

    constructor (
        public id: string,
        public user_id: string,
        public class_id: string,
        public section: string,
        public post_date: Date,
        public subject: string,
        public replies: Reply [],
        public displayReplyInput: boolean,
        public collapsed: boolean
    ) {}

  }

