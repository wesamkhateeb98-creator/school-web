import { AgeGroupModel } from "../../../shared/endpoints/models/age-group/age-group-model";
import { AcademicYearModel } from "../../academic-year/model/academic-year-model";

export interface ClassFilterViewModel {
  ageGroup?:AgeGroupModel;
  academicYear?:AcademicYearModel;
  pageNumber: number;
  pageSize: number;
}
