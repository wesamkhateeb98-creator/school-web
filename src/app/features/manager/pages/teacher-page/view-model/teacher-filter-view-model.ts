export class TeacherFilterViewModel {
    name?: string;
    phonenumber?: string;
    pageNumber: number;
    pageSize: number;

    constructor(
        pageNumber: number,
        pageSize: number,
        name?: string,
        phonenumber?: string
    ) {
        this.name = name;
        this.phonenumber = phonenumber;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}
