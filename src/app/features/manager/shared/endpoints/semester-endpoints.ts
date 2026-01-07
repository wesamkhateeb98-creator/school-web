import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MutateResponse } from '../../../shared/model/mutate-response';
import { SemesterViewModel } from '../../pages/semester/model/semester-view-model';
import { Page } from '../../../shared/model/page';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SemesterEndpoints {
  constructor(
    public http:HttpHelper
  ){}

  add(key:string, name:string): Observable<MutateResponse>{
    return this.http.post<MutateResponse>("semester",{
      key:key,
      name:name,
    })
  }

  update(semesterId:number, name:string): Observable<MutateResponse>{
    return this.http.put<MutateResponse>("semester/" + semesterId,{
      name:name
    })
  }

  get(selectedPage:number,pageSize:number,name?:string):Observable<Page<SemesterViewModel>>{
    return this.http.get<Page<SemesterViewModel>>('semester',{
        PageNumber: selectedPage,
        PageSize: pageSize,
        name:name
      })
  }

  delete(id:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>("semester/"+id);
    
  }  
}
