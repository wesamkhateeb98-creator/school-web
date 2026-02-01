import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MutateResponse } from '../../../shared/model/mutate-response';
import { Observable } from 'rxjs';
import { StudentNotesResponse } from './models/student-note/student-notes-response';
import { StudentPointsResponse } from './models/student-point/student-points-response';

@Injectable({
  providedIn: 'root',
})
export class StudentPointEndpoints {
  constructor(
    public http:HttpHelper
  ){}

  add(
    key:string, 
    points:number,
    description:string,
    studentId:number,
    academicYearSemesterId:number,
    createdAt:string
   ): Observable<MutateResponse>{
    return this.http.post<MutateResponse>("points",{
      "key": key,
      "points": points,
      "description": description,
      "studentId": studentId,
      "academicYearSemesterId": academicYearSemesterId,
      "createdAt": createdAt
    })
  }
  update(
    studentNoteId:number,
    points:number,
    description:string,
    createdAt:string): Observable<MutateResponse>{
      console.log(createdAt);
    return  this.http.put<MutateResponse>(`points/${studentNoteId}`,{
      "points": points,
      "description": description,
      "createdAt": createdAt
    })
  }

  get(studentId:number, academicYearSemesterId: number, pageNumber:number, pageSize:number):Observable<StudentPointsResponse>{
    return this.http.get<StudentPointsResponse>(`points/student/${studentId}`,{
        academicYearSemesterId: academicYearSemesterId,
        pageNumber: pageNumber,
        pageSize: pageSize
      })
  }

  delete(id:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>(`points/${id}`);
  }
}