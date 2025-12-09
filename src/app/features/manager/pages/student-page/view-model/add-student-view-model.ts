import { AgeGroupViewModel } from "../../age-group/model/age-group-view-model";


export class AddStudentViewModel {
    ageGroup!: AgeGroupViewModel;
    firstName!: string;
    lastName!: string;
    fatherName!: string;
    motherName!: string;
    address!: string;
    birthday!: Date;
    phoneNumber!: string;

    constructor(
        ageGroup: AgeGroupViewModel,
        firstName: string,
        lastName: string,
        fatherName: string,
        motherName: string,
        address: string,
        birthday: Date,
        phoneNumber: string
    ) {
        this.ageGroup = ageGroup;
        this.firstName = firstName;
        this.lastName = lastName;
        this.fatherName = fatherName;
        this.motherName = motherName;
        this.address = address;
        this.birthday = birthday;
        this.phoneNumber = phoneNumber;
    }
}