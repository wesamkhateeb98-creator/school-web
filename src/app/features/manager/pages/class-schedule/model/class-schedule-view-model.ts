import { ScheduleClassDailyModel } from "../../../shared/endpoints/models/schedule-class/schedule-class-model";

export class ScheduleClassViewModel {
  day: number;
  items: (ScheduleClassDailyViewModel|undefined)[] = [];
  
  constructor(periodsId:number[], daily:ScheduleClassDailyModel) {
    this.day = daily.day;
    periodsId.forEach(id=>{
      this.items.push(daily.items.find(x=>x.periodId == id))
    })
  }
}  

export interface ScheduleClassDailyViewModel {
  classScheduleId: number;
  subjectId: number;
  subjectName: string;
  teacherId: number;
  teacherName: string;
  periodId: number;
  lessonNumber: number; 
  fromTime: string;      
  toTime: string;        
}  

