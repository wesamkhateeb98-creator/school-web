
export class AcademicYearViewModel{
    id:number;
    year:number;
    createdAt:Date;

    constructor(id:number,year:number,createdAt:Date){
        this.id = id;
        this.year = year;
        this.createdAt = createdAt;
    }
}