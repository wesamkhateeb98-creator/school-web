
export class SubjectViewModel{
    id:number;
    name:string;
    description:string;
    ageGroupId:number;
    createdAt:Date;

    constructor(id:number, name:string, description:string ,ageGroupId:number ,createdAt:Date){
        this.id = id;
        this.name = name;
        this.description = description;
        this.ageGroupId = ageGroupId;
        this.createdAt = createdAt;
    }
}