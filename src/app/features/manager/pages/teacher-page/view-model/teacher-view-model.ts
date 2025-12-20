export class TeacherViewModel {
    id: number;
    fullName: string;
    createdAt: Date;
    phoneNumber: string;
    lock: boolean;

    constructor(
        id: number,
        fullName: string,
        phoneNumber: string,
        createdAt: Date,
        lock: boolean
    ) {
        this.id = id;
        this.fullName = fullName;
        this.createdAt = createdAt;
        this.phoneNumber = phoneNumber;
        this.lock = lock;
    }
}
