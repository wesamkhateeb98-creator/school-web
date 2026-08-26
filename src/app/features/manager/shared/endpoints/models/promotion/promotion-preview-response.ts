import { BlockerModel } from '../results/blocker-model';

export interface PromotionRow {
  studentId: number;
  fullName: string;
  currentAgeGroupId: number;
  currentAgeGroupName: string;
  currentClassId: number;
  section: number;
  targetAgeGroupId: number | null;
  targetAgeGroupName: string | null;
  action: number;
  result: number;
  decisionNote: string | null;
}

export interface PromotionPreviewResponse {
  academicYearId: number;
  year: number;
  promotedCount: number;
  repeatedCount: number;
  graduatedCount: number;
  canExecute: boolean;
  blockers: BlockerModel[];
  rows: PromotionRow[];
}
