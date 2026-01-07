import { AgeGroupModel } from "../../../shared/endpoints/models/age-group/age-group-model";

export class StudentFilterViewModel {
    name?: string;
    phonenumber?: string;
    ageGroup?: AgeGroupModel;
    pageNumber: number;
    pageSize: number;

    constructor(
        pageNumber: number,
        pageSize: number,
        name?: string,
        phonenumber?: string,
        ageGroup?: AgeGroupModel,
    ) {
        this.name = name;
        this.phonenumber = phonenumber;
        this.ageGroup = ageGroup;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}
