import { Page } from "../../../../../shared/model/page";

export interface ParentVisitResponse {
  parentVisits: Page<ParentVisitItem>;
  statistics: ParentVisitStatistics;
}

export interface ParentVisitItem {
  id: number;
  description: string;
  isVisited: boolean;
  recordedAt: Date;
  recordedBy: number | null;
  visitedAt: Date | null;
  verifiedBy: number | null;
  severity: number;
}


export interface ParentVisitStatistics {
  completedParentVisitCount: number;
  pendingParentVisitCount: number;
}