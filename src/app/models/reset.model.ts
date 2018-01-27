import { Enrollment } from './enrollment.model';
import { BoardSettings } from './boardsettings.model';

export class Reset {
    _id?: string;

    constructor (
        public resetKey: string,
        public email: string,
        public password: string,
        public password_confirmation: string,
        public token: string,  // I haven't implement this yet - but tokenizing the password should be done

    ) {}

}
