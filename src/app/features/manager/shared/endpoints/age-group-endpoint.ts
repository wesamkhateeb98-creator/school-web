import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MutateResponse } from '../../../shared/model/mutate-response';
import { Page } from '../../../shared/model/page';
import { Observable } from 'rxjs';
import { AgeGroupModel } from './models/age-group/age-group-model';
import { SubjectViewModel } from '../../pages/subject/model/subject-view-model';
import { SubjectForAgeGroupModel } from './models/age-group/subject-for-age-group-model';

@Injectable({
  providedIn: 'root',
})
export class AgeGroupEndpoints {
  constructor(
    public http:HttpHelper
  ){}

  add(key:string, name:string): Observable<MutateResponse>{
    return this.http.post<MutateResponse>("age-group",{
      key:key,
      name:name,
    })
  }

  update(semesterId:number, name:string): Observable<MutateResponse>{
    return this.http.put<MutateResponse>("age-group/" + semesterId,{
      name:name
    })
  }

  get(name:string, selectedPage:number, pageSize:number):Observable<Page<AgeGroupModel>>{
    return this.http.get<Page<AgeGroupModel>>('age-group/',{
        Name: name,
        PageNumber: selectedPage,
        PageSize: pageSize
      })
  }

  delete(id:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>("age-group/"+id);
  }

  addSubject(id:number,subjectId:number): Observable<MutateResponse>{
    return this.http.post<MutateResponse>(`age-group/${id}/subject`,{
      "subjectId": subjectId
    });
  }

  deleteSubject(id:number, subjectAgeGroupId:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>(`age-group/${id}/subject/${subjectAgeGroupId}`);
  }

  getSubjects(id:number,pageNumber:number,pageSize:number): Observable<Page<SubjectForAgeGroupModel>>{
    return this.http.get<Page<SubjectForAgeGroupModel>>(`age-group/${id}/subjects`,{
      pageNumber:pageNumber,
      pageSize:pageSize
    });
  }
}


