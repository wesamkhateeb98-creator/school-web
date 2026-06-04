export interface StudentMarkEntryModel {
  markEntryId: number;
  distributionId: number;
  distributionName: string;
  markType: number;
  maxValue: number;
  enteredValue: number | null;
  studentId: number;
  studentName: string;
}
