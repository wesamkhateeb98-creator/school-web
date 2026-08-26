import { BlockerModel } from './blocker-model';

export interface GeneratePreviewResponse {
  studentCount: number;
  confirmedSheetCount: number;
  totalSheetCount: number;
  studentsWithoutMarks: number;
  projectedPassed: number;
  projectedPending: number;
  canGenerate: boolean;
  blockers: BlockerModel[];
}
