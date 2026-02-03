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
  recordedAt: Date; // ISO date
  isReleased: boolean;
  releasedAt: Date; // ISO date
  isSolved: boolean;
  solvedAt: Date; // ISO date
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