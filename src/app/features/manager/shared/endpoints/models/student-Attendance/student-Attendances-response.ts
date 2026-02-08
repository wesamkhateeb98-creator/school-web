import { Page } from "../../../../../shared/model/page";

export interface StudentAttendanceResponse {
  attendances: Page<AttendanceItem>;
  statistics: AttendanceStatistics;
}

export interface AttendanceItem {
  id: number;
  type: number;
  description: string;
  recordedBy: number;
  recordedAt: Date;
  isReleased: boolean | undefined;
  releasedAt: Date | undefined; 
  isSolved: boolean | undefined;
  solvedAt: Date | undefined; // ISO date
}

export interface AttendanceStatistics {
  presentCount: number;
  excusedAbsenceCount: number;
  unexcusedAbsenceCount: number;
  excusedLateCount: number;
  unexcusedLateCount: number;
  excusedEarlyLeaveCount: number;
  unexcusedEarlyLeaveCount: number;
  expelledCount: number;
}