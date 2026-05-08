
export interface StudyPlanTitleModel {
  id: number;
  title: string;
}

export interface StudyPlanWeekModel {
  weekNumber: number;
  titles: StudyPlanTitleModel[];
}

export interface StudyPlanWeekRequest {
  weekNumber: number;
  title: string[];
}
