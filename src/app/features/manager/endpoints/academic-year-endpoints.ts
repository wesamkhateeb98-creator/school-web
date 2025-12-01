import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../core/services/http-helper';
import { MutateResponse } from '../../shared/model/mutate-response';
import { Page } from '../../shared/model/page';
import { Observable } from 'rxjs';
import { AcademicYearModel } from '../pages/academic-year/model/academic-year-model';
import { SemesterForAcademicYearViewModel } from '../pages/academic-year/model/semester-for-academic-year-view-model';
import { ToDateOnly } from '../../../core/consts';

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
      name:name,
    })
  }

  update(semesterId:number, name:string): Observable<MutateResponse>{
    return this.http.put<MutateResponse>("academic-year/" + semesterId,{
      name:name
    })
  }

  get(selectedPage:number, pageSize:number):Observable<Page<AcademicYearModel>>{
    return this.http.get<Page<AcademicYearModel>>('academic-year',{
        PageNumber: selectedPage,
        PageSize: pageSize
      })
  }

  delete(id:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>("academic-year/"+id);
  }
  
  getSemester(academicYearId:number, selectedPage:number, pageSize:number):Observable<Page<SemesterForAcademicYearViewModel>>{
    return this.http.get<Page<SemesterForAcademicYearViewModel>>(`academic-year/${academicYearId}/semesters`,{
        PageNumber: selectedPage,
        PageSize: pageSize
      })
  }

  addSemester(key:string,academicYearId:number, semesterId:number, startDate:Date , endDate:Date):Observable<MutateResponse>{
    return this.http.patch<MutateResponse>(`academic-year/${academicYearId}/assign-semester`,{
      key:key,
      semsterId:semesterId,
      startDate: ToDateOnly(startDate),
      endDate: ToDateOnly(endDate)
    })
  }
  deleteSemester(academicYearId:number ,academicYearSemesterId:number):Observable<MutateResponse>{
    return this.http.delete<MutateResponse>(`academic-year/${academicYearId}/unassign-semester/${academicYearSemesterId}`);
  }
}
