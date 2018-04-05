export class Announcements {
    _id?: string;

    constructor (

        public id: string,
        public class_id: string,
        public insstructor_id: string,
        public title: string,
        public announcement: string
    ) {}

}
