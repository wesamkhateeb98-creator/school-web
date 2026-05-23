import { SubjectMarkDistributionModel } from './subject-mark-distribution-model';

export interface SubjectMarkDistributionPageModel {
  pageNumber: number;
  pageSize: number;
  countPages: number;
  maxGrade: number;
  totalEnteredGrade: number;
  content: SubjectMarkDistributionModel[];
}
