
export class AcademicYearViewModel{
    id:number;
    year:number;
    createdAt:Date;
    lock:boolean
    
    constructor(id:number,year:number,lock:boolean,createdAt:Date){
        this.id = id;
        this.year = year;
        this.lock = lock;
        this.createdAt = createdAt;
    }
}