export class User {
    _id?: string;

    constructor (
        public username: string,
        public firstname: string,
        public lastname: string,
        public email: string,
        public password: string,
        public token: string,
        public verificationID: string,
        public verified: string,
        public user_type: string,
        public avatar: string, // this will be a url
        public id: string

    ) {}

}
