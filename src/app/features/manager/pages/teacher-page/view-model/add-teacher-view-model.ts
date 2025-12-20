import { AgeGroupViewModel } from "../../age-group/model/age-group-view-model";


export class AddTeacherViewModel {
    ageGroup!: AgeGroupViewModel;
    fullName!: string;
    fatherName!: string;
    motherName!: string;
    address!: string;
    birthday!: Date;
    phoneNumber!: string;

    constructor(
        ageGroup: AgeGroupViewModel,
        fullName: string,
        fatherName: string,
        motherName: string,
        address: string,
        birthday: Date,
        phoneNumber: string
    ) {
        this.ageGroup = ageGroup;
        this.fullName = fullName;
        this.fatherName = fatherName;
        this.motherName = motherName;
        this.address = address;
        this.birthday = birthday;
        this.phoneNumber = phoneNumber;
    }
}