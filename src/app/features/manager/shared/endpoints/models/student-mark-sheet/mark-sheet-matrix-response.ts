export interface MarkSheetMatrixCell {
  subjectAgeGroupId: number;
  subjectName: string;
  classId: number;
  section: number;
  markSheetId: number | null;
  status: number | null;
  enteredStudentCount: number;
  totalStudentCount: number;
}

export interface MarkSheetMatrixResponse {
  cells: MarkSheetMatrixCell[];
}
