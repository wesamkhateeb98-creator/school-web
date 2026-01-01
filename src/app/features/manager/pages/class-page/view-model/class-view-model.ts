export class TeacherViewModel {
    id: number;
    fullName: string;
    createdAt: Date;
    phoneNumber: string;

    constructor(
        id: number,
        fullName: string,
        phoneNumber: string,
        createdAt: Date
    ) {
        this.id = id;
        this.fullName = fullName;
        this.createdAt = createdAt;
        this.phoneNumber = phoneNumber;
    }
}
