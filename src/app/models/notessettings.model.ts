export class NotesSettings {
    _id?: string;

    constructor (
        public user_id: string,
        public class_id: string,
        public section: string,
        public reading: boolean,
        public folds: boolean[]

    ) {}

}
