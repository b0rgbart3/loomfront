export class LoomNotification {
    _id?: string;

    constructor (
        public type: string,
        public message: string[],
        public delay: number
    ) {}

  }

