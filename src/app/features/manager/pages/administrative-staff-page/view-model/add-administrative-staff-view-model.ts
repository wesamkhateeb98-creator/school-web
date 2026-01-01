
export class AddAdministrativeStaffViewModel {
    fullName!: string;
    phoneNumber!: string;
    permissions:number[] 
    constructor(
        fullName: string,
        phoneNumber: string,
        permissions:number[]
    ) {
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.permissions = permissions
    }
}
