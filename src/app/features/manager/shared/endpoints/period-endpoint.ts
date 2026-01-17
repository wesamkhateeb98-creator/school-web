import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MutateResponse } from '../../../shared/model/mutate-response';
import { Page } from '../../../shared/model/page';
import { Observable } from 'rxjs';
import { PeriodModel } from './models/Period/period-model';

@Injectable({
  providedIn: 'root',
})
export class PeriodEndpoints {
  constructor(
    public http:HttpHelper
  ){}

  add(key:string, lessonNumber:number ,startTime:string, endTime:string): Observable<MutateResponse>{
    return this.http.post<MutateResponse>("period",{
      "key": key,
      "lessonNumber": lessonNumber,
      "fromTime": startTime,
      "toTime": endTime
    })
  }

  update(id:number, lessonNumber:number ,startTime:string, endTime:string): Observable<MutateResponse>{
    return this.http.put<MutateResponse>(`period/${id}`,{
      "lessonNumber": lessonNumber,
      "fromTime": startTime,
      "toTime": endTime
    })
  }

  shift(time:string, sign:boolean): Observable<MutateResponse>{
    return this.http.patch<MutateResponse>(`period/shift`,{
      "shiftTime": time,
      "sign": sign
    })
  }

  get(pageNumber:number, pageSize:number):Observable<Page<PeriodModel>>{
    return this.http.get('period',{
        pageNumber: pageNumber,
        pageSize: pageSize,
        name: name
      })
  }

  getById(id:number):Observable<PeriodModel>{
    return this.http.get(`period/${id}`)
  }

  delete(id:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>(`period/${id}`);
  }
  
}