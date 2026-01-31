
export interface GetSemesterByAcademicYearModel {
  academicYearSemesterId: number;
  academicYearId: number;
  year: number;
  semesterId: number;
  semesterName: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}
