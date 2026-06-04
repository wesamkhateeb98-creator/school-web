export interface MarkTableCell {
  markEntryId: number;
  enteredValue: number | null;
}

export interface MarkTableRow {
  studentId: number;
  studentName: string;
  markEntryIds: number[];
  cellMap: Record<number, MarkTableCell>;
}
