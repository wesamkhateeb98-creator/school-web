
export class AgeGroupViewModel{
    id:number;
    name:string;
    sortOrder:number;
    createdAt:Date;

    constructor(id:number, name:string, sortOrder:number, createdAt:Date){
        this.id = id;
        this.name = name;
        this.sortOrder = sortOrder;
        this.createdAt = createdAt;
    }
}