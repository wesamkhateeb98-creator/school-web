export interface PromotionOverride {
  studentId: number;
  targetAgeGroupId: number | null;
  action: number;
  note: string;
}

export interface PromotionExecuteRequest {
  academicYearId: number;
  ageGroupId: number | null;
  overrides: PromotionOverride[];
}
