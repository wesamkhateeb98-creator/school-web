export interface MarkSheetReportSummary {
  total: number;
  withSheet: number;
  withoutSheet: number;
  confirmed: number;
  notConfirmed: number;
}

export interface PendingSubject {
  subjectAgeGroupId: number;
  subjectName: string;
  hasSheet: boolean;
  isConfirmed: boolean | null;
}

export interface AgeGroupReport {
  ageGroupId: number;
  ageGroupName: string;
  pendingSubjects: PendingSubject[];
}

export interface MarkSheetReportResponse {
  summary: MarkSheetReportSummary;
  ageGroups: AgeGroupReport[];
}
