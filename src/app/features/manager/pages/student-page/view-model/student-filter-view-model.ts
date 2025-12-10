export class StudentFilterViewModel {
    name?: string;
    phonenumber?: string;
    ageGroupName?: string;
    pageNumber: number;
    pageSize: number;

    constructor(
        pageNumber: number,
        pageSize: number,
        name?: string,
        phonenumber?: string,
        ageGroupName?: string,
    ) {
        this.name = name;
        this.phonenumber = phonenumber;
        this.ageGroupName = ageGroupName;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}
