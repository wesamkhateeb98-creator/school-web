import { PeriodViewModel } from "../../period/model/period-view-model";
import { TeacherViewModel } from "../../teacher-page/view-model/teacher-view-model";

export interface AddClassScheduleViewModel {
  day: number;
  period: PeriodViewModel;
  teacher: TeacherViewModel;
}
