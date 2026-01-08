export class SubjectForTeacherModel{
    subjectTeacherId:number;
    subjectId:number;
    name:string;
    description:string;
    createdAt:Date;

    constructor(subjectTeacherId:number, name:string, description:string , subjectId:number,createdAt:Date){
        this.subjectTeacherId = subjectTeacherId;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.subjectId = subjectId;
    }
}