export interface MarkSheetListFilter {
  academicYearId?: number | null;
  academicYearSemesterId?: number | null;
  ageGroupId?: number | null;
  classId?: number | null;
  subjectAgeGroupId?: number | null;
  status?: number | null;
  pageNumber: number;
  pageSize: number;
}
