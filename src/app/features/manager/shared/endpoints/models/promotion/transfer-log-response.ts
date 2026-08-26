export interface TransferLogItem {
  academicYearId: number;
  year: number;
  fromAgeGroupName: string;
  toAgeGroupName: string;
  action: number;
  result: number;
  note: string;
  performedByName: string;
  performedAt: string;
}

export interface TransferLogResponse {
  studentId: number;
  fullName: string;
  items: TransferLogItem[];
}
