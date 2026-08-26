export interface MarkSheetListItem {
  id: number;
  key: string;
  subjectAgeGroupId: number;
  subjectName: string;
  ageGroupId: number;
  ageGroupName: string;
  classId: number;
  section: number;
  academicYearSemesterId: number;
  semesterName: string;
  status: number;
  enteredStudentCount: number;
  totalStudentCount: number;
  lastEntryChangeAt: string;
}
