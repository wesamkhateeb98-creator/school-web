import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MutateResponse } from '../../../shared/model/mutate-response';
import { Observable } from 'rxjs';
import { StudentAttendanceResponse } from './models/student-Attendance/student-Attendances-response';
import { StudentParentVisitHistory } from '../../pages/student-parent-visit-history/student-parent-visit-history';
import { ParentVisitResponse } from './models/student-parent-visit-history/student-parent-visit-history-response';


@Injectable({
  providedIn: 'root',
})
export class StudentParentVisitHistoryEndpoints {
  constructor(
    public http:HttpHelper
  ){}

  add(
    key:string, 
    severity:number,
    description:string,
    academicYearSemesterId:number,
    studentId:number
   ): Observable<MutateResponse>{
    return this.http.post<MutateResponse>("parent-visit",{
      "key": key,
      "description": description,
      "severity": severity,
      "academicYearSemesterId": academicYearSemesterId,
      "studentId": studentId
    })
  }

  update(
    studentAttendanceId:number,
    severity:number,
    description:string,
    ): Observable<MutateResponse>{
    return  this.http.put<MutateResponse>(`parent-visit/${studentAttendanceId}`,{
      "description": description,
      "severity": severity,
    })
  }

  get(studentId:number, academicYearSemesterId: number ,isVisited:boolean, pageNumber:number, pageSize:number):Observable<ParentVisitResponse>{
    return this.http.get<ParentVisitResponse>(`parent-visit/student/${studentId}`,{
        academicYearSemesterId: academicYearSemesterId,
        isVisited: isVisited,
        pageNumber: pageNumber,
        pageSize: pageSize
      })
  }

  delete(id:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>(`parent-visit/${id}`);
  }
  
  confirmVisit(id:number): Observable<MutateResponse>{
    return this.http.patch<MutateResponse>(`parent-visit/${id}/confirm-parent-visit`,{});
  }
}