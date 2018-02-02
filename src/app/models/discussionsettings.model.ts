export class DiscussionSettings {
    _id?: string;

    constructor (
        public user_id: string,
        public class_id: string,
        public section: number,
        public discussing: boolean

    ) {}

}
