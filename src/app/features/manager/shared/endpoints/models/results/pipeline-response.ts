export interface PipelineResponse {
  academicYearId: number;
  ageGroupId: number;
  ageGroupName: string;
  academicYearSemesterId: number | null;
  stage: number;
  totalSheetCount: number;
  confirmedSheetCount: number;
  lastGeneratedAt: string | null;
  lastGeneratedByName: string | null;
  isStale: boolean;
  pendingCount: number;
  publishedSheetCount: number;
  studentCount: number;
}
