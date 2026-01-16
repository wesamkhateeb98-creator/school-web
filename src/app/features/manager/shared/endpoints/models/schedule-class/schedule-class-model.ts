
export interface ScheduleClassItem {
  classScheduleId: number;
  day: number;          
  subjectId: number;
  subjectName: string;
  teacherId: number;
  teacherName: string;
  periodId: number;
  lessonNumber: number; 
  fromTime: string;      
  toTime: string;        
}

export interface ScheduleClassModel {
  classId: number;
  classSchedules: ScheduleClassItem[];
}