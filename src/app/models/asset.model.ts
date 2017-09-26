export class Asset {
    _id?: string;

    constructor (
        public filename: string,
        public path: string,
        public uploader: string,
        public type: string,
        public length: string,
        public width: string,
        public height: string,
        public title: string,
        public description: string,
        public id: string
    ) {}
  }
