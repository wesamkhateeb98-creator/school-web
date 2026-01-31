import { Page } from "../../../../../shared/model/page";

export interface StudentPointsResponse {
  points: Page<PointItem>;
  totalPoints: number;
}

export interface PointItem {
  id: number;
  points: number;
  description: string;
  createdAt: Date;   
}