import { User } from './user.model';
import { ClassModel } from './class.model';

export class Assignment {
    _id?: string;

    constructor (
        public id: string,
        public user_id: string,
        public class_id: string,
        public status: string[],

        // non-stored parameters -- perhaps I should make these Non-Enumerable?
        public this_user: User,
        public this_class: ClassModel,

    ) {}

}
