
export class AgeGroupViewModel{
    id:number;
    name:string;
    createdAt:Date;

    constructor(id:number,name:string,createdAt:Date){
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
    }
}