
export class SemesterViewModel{
    id:number;
    name:string;
    createdAt:Date;
    lock:boolean;
    constructor(id:number,name:string,lock:boolean,createdAt:Date){
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.lock = lock;
    }
}