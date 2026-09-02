import { Injectable } from "@angular/core";
import { HttpHelper } from "../../../../core/services/http-helper";
import { Observable } from "rxjs";
import { MutateResponse } from "../../../shared/model/mutate-response";
import { Page } from "../../../shared/model/page";
import { AcademicYearModel } from "../../pages/academic-year/model/academic-year-model";
import { SemesterForAcademicYearModel } from "../../pages/academic-year/model/semester-for-academic-year-view-model";
import { ToDateOnly } from "../../../../core/consts";
import { SemesterInOpenAcademicYear } from "./models/semester/semester-in-open-academic-year";

@Injectable({
  providedIn: 'root',
})
export class AcademicYearEndpoints {
  constructor(
    public http:HttpHelper
  ){}

  add(key:string, name:string): Observable<MutateResponse>{
    return this.http.post<MutateResponse>("academic-year",{
      key:key,
      year:name
    })
  }

  update(academicYearId:number, name:string): Observable<MutateResponse>{
    return this.http.put<MutateResponse>("academic-year/" + academicYearId,{
      year:name
    })
  }

  deactive(academicYearId:number): Observable<MutateResponse>{
    return this.http.patch<MutateResponse>("academic-year/" + academicYearId + '/deactive',{})
  }

  activeYear(academicYearId:number, semesterYearId:number): Observable<MutateResponse>{
    return this.http.patch<MutateResponse>(`academic-year/${academicYearId}/active/semester/${semesterYearId}`,{})
  }

  active(academicYearId:number, academicYearSemesterId:number): Observable<MutateResponse>{
    return this.http.patch<MutateResponse>(`academic-year/${academicYearId}/semester/${academicYearSemesterId}/active`,{})
  }

  get(selectedPage:number, pageSize:number,academicYear?:number):Observable<Page<AcademicYearModel>>{
    return this.http.get<Page<AcademicYearModel>>('academic-year',{
        PageNumber: selectedPage,
        PageSize: pageSize,
        year:academicYear
      })
  }

  delete(id:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>("academic-year/"+id);
  }
  
  getSemester(academicYearId:number, selectedPage:number, pageSize:number):Observable<Page<SemesterForAcademicYearModel>>{
    return this.http.get<Page<SemesterForAcademicYearModel>>(`academic-year/${academicYearId}/semesters`,{
        PageNumber: selectedPage,
        PageSize: pageSize
      })
  }

  addSemester(key:string,academicYearId:number, semesterId:number, startDate:Date , endDate:Date):Observable<MutateResponse>{
    return this.http.post<MutateResponse>(`academic-year/${academicYearId}/semester/assign`,{
      key:key,
      semesterId:semesterId,
      startDate: ToDateOnly(startDate),
      endDate: ToDateOnly(endDate)
    })
  }

  deactiveSemester(academicYearId:number, semesterYearId:number): Observable<MutateResponse>{
    return this.http.patch<MutateResponse>(`academic-year/${academicYearId}/semester/${semesterYearId}/deactive`,{})
  }

  deleteSemester(academicYearId:number ,academicYearSemesterId:number):Observable<MutateResponse>{
    return this.http.delete<MutateResponse>(`academic-year/${academicYearId}/semester-in-academic-year/${academicYearSemesterId}/unassign`);
  }

  updateSemester(academicYearId:number, semesterInAcademicYearId:number, semesterId:number, startDate:Date , endDate:Date):Observable<MutateResponse>{
    
    return this.http.put<MutateResponse>(`academic-year/${academicYearId}/semester-in-academic-year/${semesterInAcademicYearId}`,{
      semesterId:semesterId,
      startDate: ToDateOnly(startDate),
      endDate: ToDateOnly(endDate)
    })
  }

  getSemesterForOpenAcademicYear(academicYear:number):Observable<SemesterInOpenAcademicYear>{
    return this.http.get<SemesterInOpenAcademicYear>('academic-year/' + academicYear + '/semester-in-open-academic-year',{})
  }
}


