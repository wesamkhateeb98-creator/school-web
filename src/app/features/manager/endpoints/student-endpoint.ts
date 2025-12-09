import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../core/services/http-helper';
import { MutateResponse } from '../../shared/model/mutate-response';
import { Page } from '../../shared/model/page';
import { Observable } from 'rxjs';
import { SemesterForAcademicYearModel, SemesterForAcademicYearViewModel } from '../pages/academic-year/model/semester-for-academic-year-view-model';
import { ToDateOnly } from '../../../core/consts';
import { AcademicYearViewModel } from '../pages/academic-year/model/academic-year-view-model';
import { AcademicYearModel } from '../pages/academic-year/model/academic-year-model';
import { AddStudentViewModel } from '../pages/student-page/view-model/add-student-view-model';
import { StudentModel } from './models/student/student-model';
import { StudentFilterViewModel } from '../pages/student-page/view-model/student-filter-view-model';

@Injectable({
  providedIn: 'root',
})
export class StudentEndpoints {
  constructor(
    public http:HttpHelper
  ){}

  add(key:string, addModel:AddStudentViewModel ): Observable<MutateResponse>{
    return this.http.post<MutateResponse>("student",{
      "key": key,
      "ageGroupId": addModel.ageGroup.id,
      "firstName": addModel.firstName,
      "lastName": addModel.lastName,
      "fatherName": addModel.fatherName,
      "motherName": addModel.motherName,
      "address": addModel.address,
      "birthday": addModel.birthday,
      "phoneNumber": addModel.phoneNumber
    })
  }

  update(studentId:number, addModel:AddStudentViewModel): Observable<MutateResponse>{
    return this.http.put<MutateResponse>(`student/${studentId}`,{
      "ageGroupId": addModel.ageGroup.id,
      "firstName": addModel.firstName,
      "lastName": addModel.lastName,
      "fatherName": addModel.fatherName,
      "motherName": addModel.motherName,
      "address": addModel.address,
      "birthday": addModel.birthday,
      "phoneNumber": addModel.phoneNumber
    })
  }

  get(filter:StudentFilterViewModel):Observable<Page<StudentModel>>{
    return this.http.get<Page<StudentModel>>('academic-year',{
        name: filter.name,
        phoneNumber: filter.phoneNumber,
        AgeGroupId: filter.ageGroupId,
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize
      })
  }

  delete(id:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>(`student/${id}`);
  }
  
}