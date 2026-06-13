import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MutateResponse } from '../../../shared/model/mutate-response';
import { Page } from '../../../shared/model/page';
import { Observable } from 'rxjs';
import { AddStudentViewModel } from '../../pages/student-page/view-model/add-student-view-model';
import { StudentModel } from './models/student/student-model';
import { StudentFilterViewModel } from '../../pages/student-page/view-model/student-filter-view-model';
import { ClassStudentModel } from './models/student/class-student-model';
import { StudentByIdModel } from './models/student/student-by-id-model';

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
      "fullName": addModel.fullName,
      "fatherName": addModel.fatherName,
      "motherName": addModel.motherName,
      "address": addModel.address,
      "birthday": addModel.birthday,
      "phoneNumber": addModel.phoneNumber,
      "status": addModel.status
    })
  }

  update(studentId:number, addModel:AddStudentViewModel): Observable<MutateResponse>{
    return this.http.put<MutateResponse>(`student/${studentId}`,{
      "ageGroupId": addModel.ageGroup.id,
      "fullName": addModel.fullName,
      "fatherName": addModel.fatherName,
      "motherName": addModel.motherName,
      "address": addModel.address,
      "birthday": addModel.birthday,
      "phoneNumber": addModel.phoneNumber
    })
  }

  get(filter:StudentFilterViewModel):Observable<Page<StudentModel>>{
    return this.http.get<Page<StudentModel>>('student',{
        name: filter.name,
        phoneNumber: filter.phonenumber,
        AgeGroupId: filter.ageGroup?.id??0 >= 0? filter.ageGroup?.id : 0,
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize
      })
  }

  delete(id:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>(`student/${id}`);
  }
  

  getStudentsClass(classId:number, name:string, pageNumber:number, pageSize:number)
    :Observable<Page<ClassStudentModel>>{
    return this.http.get<Page<ClassStudentModel>>(`student/class/${classId}`,{
        name: name,
        pageNumber: pageNumber,
        pageSize: pageSize
      })
  }

  getStudentById(studentId:number):Observable<StudentByIdModel>{
    return this.http.get<StudentByIdModel>(`student/${studentId}`,)
  }

  getStudentsSimple(name: string, pageNumber: number, pageSize: number, ageGroupId?: number): Observable<Page<{ id: number; fullName: string }>> {
    return this.http.get<Page<{ id: number; fullName: string }>>('student/filter', {
      Name: name,
      AgeGroupId: ageGroupId,
      pageNumber,
      pageSize,
    });
  }
}