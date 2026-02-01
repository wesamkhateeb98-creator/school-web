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
  presenceCount: number;
  absenceCount: number;
  latenessCount: number;
  escapedCount: number;
  excusedCount: number;
  expelledCount: number;
}