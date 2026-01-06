import { AcademicYearStatus } from "../../../../../core/enums/academic-year-status";

export class AcademicYearViewModel{
    id:number;
    year:number;
    status:AcademicYearStatus;
    createdAt:Date;
    constructor(id:number,year:number,status:AcademicYearStatus,createdAt:Date){
        this.id = id;
        this.year = year;
        this.createdAt = createdAt;
        this.status = status
    }
}