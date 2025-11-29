import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../core/services/http-helper';
import { MutateResponse } from '../../shared/model/mutate-response';
import { SemesterViewModel } from '../pages/semester/model/semester-view-model';
import { Page } from '../../shared/model/page';
import { Observable } from 'rxjs';
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
}
