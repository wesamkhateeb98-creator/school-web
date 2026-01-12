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
    return this.http.post<MutateResponse>("web/period",{
      "key": key,
      "lessonNumber": lessonNumber,
      "fromTime": startTime,
      "toTime": endTime
    })
  }

  update(id:number, lessonNumber:number ,startTime:string, endTime:string): Observable<MutateResponse>{
    return this.http.put<MutateResponse>(`web/period/${id}`,{
      "lessonNumber": lessonNumber,
      "fromTime": startTime,
      "toTime": endTime
    })
  }

  shift(id:number, hour:number, second:number, sign:boolean): Observable<MutateResponse>{
    return this.http.put<MutateResponse>(`web/period/${id}`,{
      "shiftTime": `${hour<10?`0${hour}`:hour}:${second<10?`0${second}`:second}:00`,
      "sign": sign
    })
  }

  get(pageNumber:number, pageSize:number):Observable<Page<PeriodModel>>{
    return this.http.get('web/period',{
        pageNumber: pageNumber,
        pageSize: pageSize,
        name: name
      })
  }

  delete(id:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>(`web/period/${id}`);
  }
  
}