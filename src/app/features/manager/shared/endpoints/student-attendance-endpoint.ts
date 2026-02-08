import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MutateResponse } from '../../../shared/model/mutate-response';
import { Observable } from 'rxjs';
import { StudentAttendanceResponse } from './models/student-Attendance/student-Attendances-response';


@Injectable({
  providedIn: 'root',
})
export class StudentAttendanceEndpoints {
  constructor(
    public http:HttpHelper
  ){}

  add(
    key:string, 
    type:number,
    description:string,
    recordedAt:string,
    academicYearSemesterId:number,
    studentId:number
   ): Observable<MutateResponse>{
    console.log({
      "key": key,
      "type": type,
      "description": description,
      "recordedAt": recordedAt,
      "academicYearSemesterId": academicYearSemesterId,
      "studentId": studentId
    });
    return this.http.post<MutateResponse>("student-Attendance",{
      "key": key,
      "type": type,
      "description": description,
      "recordedAt": recordedAt,
      "academicYearSemesterId": academicYearSemesterId,
      "studentId": studentId
    })
  }
  
  update(
    studentAttendanceId:number,
    type:number,
    description:string,
    recordedAt:string): Observable<MutateResponse>{
    return  this.http.put<MutateResponse>(`student-Attendance/${studentAttendanceId}`,{
      "type": type,
      "description": description,
      "recordedAt": recordedAt
    })
  }

  get(studentId:number, academicYearSemesterId: number ,type:number, pageNumber:number, pageSize:number):Observable<StudentAttendanceResponse>{
    return this.http.get<StudentAttendanceResponse>(`student-Attendance/student/${studentId}`,{
        academicYearSemesterId: academicYearSemesterId,
        type: type,
        pageNumber: pageNumber,
        pageSize: pageSize
      })
  }

  delete(id:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>(`student-Attendance/${id}`);
  }
  
  releaseToParent(id:number): Observable<MutateResponse>{
    return this.http.patch<MutateResponse>(`student-Attendance/${id}/release-to-parent`,{});
  }

  solve(id:number): Observable<MutateResponse>{
    return this.http.patch<MutateResponse>(`student-Attendance/${id}/solve`,{});
  }
}