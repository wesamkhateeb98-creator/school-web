export interface ClassScheduleTableSchema{
    key:string;
    id:number;
    label:string; 
    sticky:boolean;
    stickyEnd:boolean;
}

export interface AddClassScheduleTableSchema{
    key:string;
    label:string; 
    sticky:boolean;
    stickyEnd:boolean;
}