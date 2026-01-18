import { PeriodViewModel } from "../../period/model/period-view-model";
import { SubjectViewModel } from "../../subject/model/subject-view-model";
import { TeacherViewModel } from "../../teacher-page/view-model/teacher-view-model";

export interface AddClassScheduleViewModel {
  subject: SubjectViewModel;
  period: PeriodViewModel;
  teacher: TeacherViewModel;
}
