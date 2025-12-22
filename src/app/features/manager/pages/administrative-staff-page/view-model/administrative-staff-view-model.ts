export class AdministrativeStaffViewModel {
    id: number;
    fullName: string;
    phoneNumber: string;
    createdAt: Date;
    lock: boolean;
    permissions:number[]

    constructor(
        id: number,
        fullName: string,
        phoneNumber: string,
        createdAt: Date,
        lock: boolean,
        permissions:number[]
    ) {
        this.id = id;
        this.fullName = fullName;
        this.createdAt = createdAt;
        this.phoneNumber = phoneNumber;
        this.lock = lock;
        this.permissions = permissions;
    }
}
