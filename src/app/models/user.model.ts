export class User {
    _id?: string;

    constructor (
        public username: string,
        public firstname: string,
        public lastname: string,
        public email: string,
        public password: string,
        public user_type: string

    ) {}

}
