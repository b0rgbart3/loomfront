import { User } from './user.model';
import { ClassModel } from './class.model';

export class Enrollment {
    _id?: string;

    constructor (
        public id: string,
        public user_id: string,
        public class_id: string,
        public participation: string,
        public status: string[],

        // non-stored parameters
        public this_user: User,
        public this_class: ClassModel,

    ) {}

}
