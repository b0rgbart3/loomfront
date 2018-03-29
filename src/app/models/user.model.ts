import { Enrollment } from './enrollment.model';
import { BoardSettings } from './boardsettings.model';

export class User {
    _id?: string;

    constructor (
        public id: string,
        public username: string,
        public firstname: string,
        public middlename: string,
        public lastname: string,
        public email: string,
        public bio: string,
        public password: string,
        public token: string,
        public verificationID: string,
        public verified: string,
        public facebookRegistration: boolean,
        public instructor: boolean,
        public admin: boolean,
        public suspended: boolean,
        public favoritecolor: string,
        public avatar_filename: string,
        public avatar_URL: string,
        public created_date: string,
        public verified_date: string,
        public completed_classes: string[],
        public completed_series: string[],


    ) {}

}
