import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MutateResponse } from '../../../shared/model/mutate-response';
import { Observable } from 'rxjs';
import { StudentNotesResponse } from './models/semester/student-notes-response';

@Injectable({
  providedIn: 'root',
})
export class StudentNoteEndpoints {
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
    return this.http.post<MutateResponse>("student-note",{
      "key": key,
      "type": type,
      "description": description,
      "recordedAt": recordedAt,
      "academicYearSemesterId": academicYearSemesterId,
      "studentId": studentId
    })
  }
  update(
    studentNoteId:number,
    type:number,
    description:string,
    recordedAt:string): Observable<MutateResponse>{
    return  this.http.put<MutateResponse>(`student-note/${studentNoteId}`,{
      "type": type,
      "description": description,
      "recordedAt": recordedAt
    })
  }

  get(studentId:number, academicYearSemesterId: number ,type:number, pageNumber:number, pageSize:number):Observable<StudentNotesResponse>{
    return this.http.get<StudentNotesResponse>(`student-note/student/${studentId}`,{
        academicYearSemesterId: academicYearSemesterId,
        type: type,
        pageNumber: pageNumber,
        pageSize: pageSize
      })
  }

  delete(id:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>(`student-note/${id}`);
  }
  
  releaseToParent(id:number): Observable<MutateResponse>{
    return this.http.patch<MutateResponse>(`student-note/${id}/release-to-parent`,{});
  }

  solve(id:number): Observable<MutateResponse>{
    return this.http.patch<MutateResponse>(`student-note/${id}/solve`,{});
  }
}