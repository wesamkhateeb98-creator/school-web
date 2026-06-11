import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MutateResponse } from '../../../shared/model/mutate-response';
import { Page } from '../../../shared/model/page';
import { Observable } from 'rxjs';
import {
  AssignmentPayload,
  AssignmentResponse,
  AssignmentUpdatePayload,
  StudentEvaluationPayload,
  StudentEvaluationResponse,
  StudentEvaluationUpdatePayload,
  StudentForAssignmentItem,
} from '../../pages/assignments/model/assignment.model';

@Injectable({ providedIn: 'root' })
export class AssignmentEndpoints {
  constructor(public http: HttpHelper) {}

  get(
    pageNumber: number,
    pageSize: number,
    classId?: number,
    subjectAgeGroupId?: number,
    type?: number
  ): Observable<Page<AssignmentResponse>> {
    return this.http.get<Page<AssignmentResponse>>('assignment', {
      PageNumber: pageNumber,
      PageSize: pageSize,
      ClassId: classId,
      SubjectAgeGroupId: subjectAgeGroupId,
      Type: type,
    });
  }

  getById(id: number): Observable<AssignmentResponse> {
    return this.http.get<AssignmentResponse>(`assignment/${id}`);
  }

  getStudentEvaluations(
    classAssignmentId: number,
    pageNumber: number,
    pageSize: number,
    studentId?: number,
  ): Observable<Page<StudentEvaluationResponse>> {
    return this.http.get<Page<StudentEvaluationResponse>>(
      `student-evaluation/${classAssignmentId}/students`,
      { PageNumber: pageNumber, PageSize: pageSize, StudentId: studentId },
    );
  }

  getStudentsForDropdown(
    pageNumber: number,
    pageSize: number,
    classAssignmentId?: number,
    name?: string,
  ): Observable<Page<StudentForAssignmentItem>> {
    return this.http.get<Page<StudentForAssignmentItem>>(
      'student/by-class-assignment',
      { PageNumber: pageNumber, PageSize: pageSize, ClassAssignmentId: classAssignmentId, Name: name || undefined },
    );
  }

  add(body: AssignmentPayload): Observable<MutateResponse> {
    return this.http.post<MutateResponse>('assignment', body);
  }

  update(id: number, body: AssignmentUpdatePayload): Observable<MutateResponse> {
    return this.http.put<MutateResponse>(`assignment/${id}`, body);
  }

  delete(id: number): Observable<MutateResponse> {
    return this.http.delete<MutateResponse>(`assignment/${id}`);
  }

  addStudentEvaluation(body: StudentEvaluationPayload): Observable<MutateResponse> {
    return this.http.post<MutateResponse>('student-evaluation', body);
  }

  updateStudentEvaluation(id: number, body: StudentEvaluationUpdatePayload): Observable<MutateResponse> {
    return this.http.put<MutateResponse>(`student-evaluation/${id}`, body);
  }

  deleteStudentEvaluation(id: number): Observable<MutateResponse> {
    return this.http.delete<MutateResponse>(`student-evaluation/${id}`);
  }
}
