export class StudentViewModel {
    id: number;
    ageGroupId: number;
    ageGroupName: string;
    firstName: string;
    lastName: string;
    name: string;
    fatherName: string;
    motherName: string;
    address: string;
    birthday: Date;
    phoneNumber: string;
    lock: boolean;

    constructor(
        id: number,
        ageGroupId: number,
        ageGroupName: string,
        firstName: string,
        lastName: string,
        fatherName: string,
        motherName: string,
        address: string,
        birthday: Date,
        phoneNumber: string,
        lock: boolean
    ) {
        this.id = id;
        this.ageGroupId = ageGroupId;
        this.ageGroupName = ageGroupName;
        this.name = `${firstName} ${lastName}`;
        this.firstName = firstName;
        this.lastName = lastName;
        
        this.fatherName = fatherName;
        this.motherName = motherName;
        this.address = address;
        this.birthday = birthday;
        this.phoneNumber = phoneNumber;
        this.lock = lock;
    }
}
