export class Announcements {
    _id?: string;

    constructor (

        public id: number,
        public class_id: number,
        public insstructor_id: number,
        public announcement_date: DateTimeFormat,
        public title: string,
        public announcement: string
    ) {}

}
