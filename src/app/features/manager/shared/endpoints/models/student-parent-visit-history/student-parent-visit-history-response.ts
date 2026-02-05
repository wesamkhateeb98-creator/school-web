import { Page } from "../../../../../shared/model/page";

export interface ParentVisitResponse {
  parentVisit: Page<ParentVisitItem>;
  statistics: ParentVisitStatistics;
}

export interface ParentVisitItem {
  id: number;
  description: string;
  isVisited: boolean;
  recordedAt: Date;
  recordedBy: number;
  visitedAt: Date;
  verifiedBy: number;
  severity: number;
}

export interface ParentVisitStatistics {
  completedParentVisitCount: number;
  pendingParentVisitCount: number;
}