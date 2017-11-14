import { Enrollment } from './enrollment.model';

export class BoardSettings {
    _id?: string;

    constructor (
        public discussing: string,
        public side: string,
        public width: string

    ) {}

}
