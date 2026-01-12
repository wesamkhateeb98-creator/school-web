import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MutateResponse } from '../../../shared/model/mutate-response';
import { Page } from '../../../shared/model/page';
import { Observable } from 'rxjs';
import { AddTeacherViewModel } from '../../pages/teacher-page/view-model/add-teacher-view-model';
import { TeacherFilterViewModel } from '../../pages/teacher-page/view-model/teacher-filter-view-model';
import { TeacherModel } from './models/teacher/teacher-model';
import { SubjectForTeacherModel } from './models/teacher/subject-for-teacher-model';

@Injectable({
  providedIn: 'root',
})
export class TeacherEndpoints {
  constructor(
    public http:HttpHelper
  ){}

  add(key:string, addModel:AddTeacherViewModel ): Observable<MutateResponse>{
    return this.http.post<MutateResponse>("teacher",{
      "key": key,
      "fullName": addModel.fullName,
      "phoneNumber": addModel.phoneNumber
    })
  }
  
  update(teacherId:number, addModel:AddTeacherViewModel): Observable<MutateResponse>{
    return this.http.put<MutateResponse>(`teacher/${teacherId}`,{
      "fullName": addModel.fullName,
      "phoneNumber": addModel.phoneNumber
    })
  }

  get(filter:TeacherFilterViewModel):Observable<Page<TeacherModel>>{
    return this.http.get<Page<TeacherModel>>('teacher',{
        name: filter.name,
        phoneNumber: filter.phonenumber,
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize
      })
  }

  delete(id:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>(`teacher/${id}`);
  }
  
  addSubject(id:number,subjectId:number): Observable<MutateResponse>{
      
      return this.http.post<MutateResponse>(`teacher/${id}/subject`,{
        "subjectId": subjectId
      });
    }
  
  deleteSubject(id:number, subjectAgeGroupId:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>(`teacher/${id}/subject/${subjectAgeGroupId}`);
  }
  
  getSubjects(id:number,pageNumber:number,pageSize:number): Observable<Page<SubjectForTeacherModel>>{
    return this.http.get<Page<SubjectForTeacherModel>>(`teacher/${id}/subjects`,{
      pageNumber:pageNumber,
      pageSize:pageSize
    });
  }
}