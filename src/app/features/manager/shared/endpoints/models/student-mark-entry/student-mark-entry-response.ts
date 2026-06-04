import { StudentMarkEntryModel } from './student-mark-entry-model';

export interface StudentMarkEntryResponse {
  subjectId: number;
  subjectName: string;
  ageGroupId: number;
  ageGroupName: string;
  minPassGrade: number;
  maxGrade: number;
  totalScore: number;
  totalMaxScore: number;
  entries: StudentMarkEntryModel[];
}
