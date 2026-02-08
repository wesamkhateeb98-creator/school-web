export class StudentViewModel {
    id: number;
    ageGroupId: number;
    ageGroupName: string;
    fullName: string;
    fatherName: string;
    motherName: string;
    address: string;
    birthday: Date;
    phoneNumber: string;
    lock: boolean;
    status: number;
    isExpelled: boolean;
    isVisitParentRequired: boolean;

    constructor(
        id: number,
        ageGroupId: number,
        ageGroupName: string,
        fullName: string,
        fatherName: string,
        motherName: string,
        address: string,
        birthday: Date,
        phoneNumber: string,
        lock: boolean,
        status: number,
        isExpelled: boolean,
        isVisitParentRequired: boolean
    ) {
        this.id = id;
        this.ageGroupId = ageGroupId;
        this.ageGroupName = ageGroupName;
        this.fullName = fullName;
        
        this.fatherName = fatherName;
        this.motherName = motherName;
        this.address = address;
        this.birthday = birthday;
        this.phoneNumber = phoneNumber;
        this.lock = lock;

        this.status = status;
        this.isExpelled = isExpelled
        this.isVisitParentRequired = isVisitParentRequired
    }
}
