
export class AcademicYearViewModel{
    id:number;
    academicYear:string;
    createdAt:Date;

    constructor(id:number,year:number,createdAt:Date){
        this.id = id;
        this.academicYear = `${year}-${year+1}`;
        this.createdAt = createdAt;
    }
}