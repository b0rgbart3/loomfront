import { Enrollment } from './enrollment.model';

export class User {
    _id?: string;

    constructor (
        public id: string,
        public username: string,
        public firstname: string,
        public lastname: string,
        public email: string,
        public password: string,
        public token: string,
        public verificationID: string,
        public verified: string,
        public user_type: string[],
        public status: string[],
        public favoritecolor: string,
        public avatar_filename: string,
        public avatar_path: string,
        public avatar_URL: string,
        public completed_classes: string[],
        public completed_series: string[],
        public enrollments: Enrollment[]

    ) {}

}
