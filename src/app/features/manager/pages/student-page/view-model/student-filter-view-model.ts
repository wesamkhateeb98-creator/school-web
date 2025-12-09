export class StudentFilterViewModel {
    name?: string;
    phoneNumber?: string;
    ageGroupId?: number;
    pageNumber: number;
    pageSize: number;

    constructor(
        pageNumber: number,
        pageSize: number,
        name?: string,
        phoneNumber?: string,
        ageGroupId?: number,
    ) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.ageGroupId = ageGroupId;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}
