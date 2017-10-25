export class Thread {
    _id?: string;

    constructor (
        public id: string,
        public user_id: string,
        public classID: string,
        public post_date: Date,
        public subject: string,
        public replies: any [],
        public displayReplyInput: boolean
    ) {}

  }

