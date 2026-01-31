import { Page } from "../../../../../shared/model/page";

export interface StudentNotesResponse {
  notes: Page<NoteItem>;
  statistics: NotesStatistics;
}

export interface NoteItem {
  id: number;
  type: number;
  description: string;
  recordedBy: number;
  recordedAt: Date;   // ISO DateTime
  isReleased: boolean;
  releasedAt: Date | null;
  isSolved: boolean;
  solvedAt: Date | null;
}

export interface NotesStatistics {
  academicCount: number;
  behavioralCount: number;
}