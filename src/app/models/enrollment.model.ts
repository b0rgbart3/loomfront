export class Enrollment {
    _id?: string;

    constructor (
        public class_id: string,
        public roles: string[],
        public status: string[]

    ) {}

}
