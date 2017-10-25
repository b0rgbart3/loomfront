export class Thread {
    _id?: string;

    constructor (
        public id: number,
        public user_id: string,
        public classID: number,
        public post_date: Date,
        public subject: string,
        public replies: any [],
    ) {}

  }

