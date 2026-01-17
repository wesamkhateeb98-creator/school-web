
export interface ScheduleClassModel {
  classId: number;
  classSchedules: ScheduleClassDailyModel[];
}

export interface ScheduleClassDailyModel {
  day: number;
  items: ScheduleClassDailyItemModel[];
}  

export interface ScheduleClassDailyItemModel {
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

