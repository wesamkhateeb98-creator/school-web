import { PipelineResponse } from './pipeline-response';
import { Page } from '../../../../../shared/model/page';

export interface FailedSubjectModel {
  subjectAgeGroupId: number;
  subjectName: string;
  academicYearSemesterId: number;
  semesterName: string;
  mark: number;
  minPassGrade: number;
}

export interface StudentSemesterTotalModel {
  academicYearSemesterId: number;
  semesterName: string;
  total: number;
}

export interface StudentResultListItem {
  studentId: number;
  fullName: string;
  classId: number;
  section: number;
  semesters: StudentSemesterTotalModel[];
  finalTotal: number;
  maxTotal: number;
  minTotal: number;
  failedSubjectCount: number;
  computedStatus: number;
  finalStatus: number | null;
  decisionNote: string | null;
  decidedByName: string | null;
  decidedAt: string | null;
  failedSubjects: FailedSubjectModel[];
}

export interface ResultsAgeGroupSummary {
  ageGroupId: number;
  ageGroupName: string;
  subjectCount: number;
  maxTotal: number;
  minTotal: number;
}

export interface StudentResultListResponse {
  ageGroup: ResultsAgeGroupSummary;
  pipeline: PipelineResponse;
  students: Page<StudentResultListItem>;
}
