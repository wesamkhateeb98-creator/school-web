interface TitleModel {
  id: number;
  title: string;
}

interface WeekModel {
  weekNumber: number;
  titles: TitleModel[];
}