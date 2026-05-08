export class SubjectForAgeGroupModel{
    id:number;
    subjectId:number;
    name:string;
    description:string;
    maxGrade:number;
    minPassGrade:number;
    createdAt:Date;

    constructor(id:number, name:string, description:string , subjectId:number, maxGrade:number, minPassGrade:number, createdAt:Date){
        this.id = id;
        this.name = name;
        this.description = description;
        this.maxGrade = maxGrade;
        this.minPassGrade = minPassGrade;
        this.createdAt = createdAt;
        this.subjectId = subjectId;
    }
}