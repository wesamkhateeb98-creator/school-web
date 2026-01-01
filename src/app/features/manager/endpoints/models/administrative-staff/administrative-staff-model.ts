export class AdministrativeStaffModel {
    id: number;
    fullName: string;
    phoneNumber: string;
    createdAt: Date;
    permissions:number[]

    constructor(
        id: number,
        fullName: string,
        phoneNumber: string,
        createdAt: Date,
        permissions:number[]
    ) {
        this.id = id;
        this.fullName = fullName;
        this.createdAt = createdAt;
        this.phoneNumber = phoneNumber;
        this.permissions = permissions;
    }
}
