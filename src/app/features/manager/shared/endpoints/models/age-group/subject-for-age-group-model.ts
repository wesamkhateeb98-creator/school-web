export class subjectForAgeGroupModel{
    id:number;
    subjectId:number;
    name:string;
    description:string;
    createdAt:Date;

    constructor(id:number, name:string, description:string , subjectId:number,createdAt:Date){
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.subjectId = subjectId;
    }
}