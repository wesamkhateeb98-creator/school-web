export interface MarkSheetDetailSheet {
  id: number;
  key: string;
  subjectName: string;
  ageGroupName: string;
  section: number;
  semesterName: string;
  maxGrade: number;
  minPassGrade: number;
  status: number;
  acceptsEntries: boolean;
}

export interface MarkSheetDetailColumn {
  distributionId: number;
  name: string;
  weight: number;
  maxValue: number;
  markType: number;
}

export interface MarkSheetDetailCell {
  distributionId: number;
  value: number | null;
}

export interface MarkSheetDetailRow {
  studentId: number;
  fullName: string;
  cells: MarkSheetDetailCell[];
  total: number | null;
  isComplete: boolean;
  isPassed: boolean | null;
}

export interface MarkSheetDetailResponse {
  sheet: MarkSheetDetailSheet;
  columns: MarkSheetDetailColumn[];
  rows: MarkSheetDetailRow[];
  enteredStudentCount: number;
  totalStudentCount: number;
}
