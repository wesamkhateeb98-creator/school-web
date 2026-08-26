export interface StudentResultComponentMark {
  name: string;
  value: number | null;
  maxValue: number;
}

export interface StudentResultSubjectInSemester {
  subjectAgeGroupId: number;
  subjectName: string;
  maxGrade: number;
  minPassGrade: number;
  total: number | null;
  components: StudentResultComponentMark[];
}

export interface StudentResultSemesterDetail {
  academicYearSemesterId: number;
  semesterName: string;
  subjects: StudentResultSubjectInSemester[];
}

export interface StudentResultFinalSubject {
  subjectAgeGroupId: number;
  subjectName: string;
  finalMark: number;
  maxGrade: number;
  minPassGrade: number;
  isPassed: boolean;
}

export interface StudentResultDetailResponse {
  studentId: number;
  fullName: string;
  semesters: StudentResultSemesterDetail[];
  subjects: StudentResultFinalSubject[];
}
