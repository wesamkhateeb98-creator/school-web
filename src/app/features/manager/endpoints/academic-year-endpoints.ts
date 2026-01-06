import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../core/services/http-helper';
import { MutateResponse } from '../../shared/model/mutate-response';
import { Page } from '../../shared/model/page';
import { Observable } from 'rxjs';
import { SemesterForAcademicYearModel, SemesterForAcademicYearViewModel } from '../pages/academic-year/model/semester-for-academic-year-view-model';
import { ToDateOnly } from '../../../core/consts';
import { AcademicYearViewModel } from '../pages/academic-year/model/academic-year-view-model';
import { AcademicYearModel } from '../pages/academic-year/model/academic-year-model';

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
      year:name,
    })
  }

  update(academicYearId:number, name:string): Observable<MutateResponse>{
    return this.http.put<MutateResponse>("academic-year/" + academicYearId,{
      year:name
    })
  }

  end(academicYearId:number): Observable<MutateResponse>{
    console.log(academicYearId);
    return this.http.patch<MutateResponse>("academic-year/" + academicYearId + '/end',{})
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
      semsterId:semesterId,
      startDate: ToDateOnly(startDate),
      endDate: ToDateOnly(endDate)
    })
  }

  deleteSemester(academicYearId:number ,academicYearSemesterId:number):Observable<MutateResponse>{
    return this.http.delete<MutateResponse>(`academic-year/${academicYearId}/semester-in-academic-year/${academicYearSemesterId}/unassign`);
  }

  updateSemester(academicYearId:number, semesterInAcademicYearId:number, semesterId:number, startDate:Date , endDate:Date):Observable<MutateResponse>{
    console.log(ToDateOnly(startDate));
    return this.http.put<MutateResponse>(`academic-year/${academicYearId}/semester-in-academic-year/${semesterInAcademicYearId}`,{
      semsterId:semesterId,
      startDate: ToDateOnly(startDate),
      endDate: ToDateOnly(endDate)
    })
  }
}


