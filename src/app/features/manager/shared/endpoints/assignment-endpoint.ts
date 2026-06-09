import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MutateResponse } from '../../../shared/model/mutate-response';
import { Page } from '../../../shared/model/page';
import { Observable } from 'rxjs';
import {
  AssignmentPayload,
  AssignmentResponse,
  AssignmentUpdatePayload,
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

  add(body: AssignmentPayload): Observable<MutateResponse> {
    return this.http.post<MutateResponse>('assignment', body);
  }

  update(id: number, body: AssignmentUpdatePayload): Observable<MutateResponse> {
    return this.http.put<MutateResponse>(`assignment/${id}`, body);
  }

  delete(id: number): Observable<MutateResponse> {
    return this.http.delete<MutateResponse>(`assignment/${id}`);
  }
}
