export class Enrollment {
    _id?: string;

    constructor (
        public id: string,
        public roles: string[],
        public status: string[]

    ) {}

}
