
export class SemesterViewModel{
    id:number;
    name:string;
    startDate:Date;
    endDate:Date;
    createdAt:Date;

    constructor(id:number,name:string,startDate:Date,endDate:Date,createdAt:Date){
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdAt = createdAt;
    }
}