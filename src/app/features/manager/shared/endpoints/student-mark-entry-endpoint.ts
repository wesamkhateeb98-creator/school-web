import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MutateResponse } from '../../../shared/model/mutate-response';
import { Page } from '../../../shared/model/page';
import { StudentMarkEntryModel } from './models/student-mark-entry/student-mark-entry-model';
import { StudentMarkEntryResponse } from './models/student-mark-entry/student-mark-entry-response';
import { StudentSimpleModel } from './models/student/student-simple-model';

@Injectable({ providedIn: 'root' })
export class StudentMarkEntryEndpoints {
  constructor(private http: HttpHelper) {}

  getEntries(markSheetId: number, studentId?: number): Observable<StudentMarkEntryResponse> {
    return this.http.get<StudentMarkEntryResponse>(`StudentMarkEntry/sheet/${markSheetId}`, {
      studentId: studentId ?? undefined,
    });
  }

  add(
    key: string,
    studentMarkSheetId: number,
    studentId: number,
    entries: { subjectMarkDistributionId: number; value: number }[],
  ): Observable<number[]> {
    return this.http.post<number[]>('StudentMarkEntry', {
      key,
      studentMarkSheetId,
      studentId,
      entries,
    });
  }

  update(studentId: number, distributionId: number, value: number): Observable<MutateResponse> {
    return this.http.put<MutateResponse>('StudentMarkEntry', { studentId, distributionId, value });
  }

  delete(markEntryId: number): Observable<MutateResponse> {
    return this.http.delete<MutateResponse>(`StudentMarkEntry/${markEntryId}`);
  }

  getStudents(
    subjectAgeGroupId: number,
    pageNumber: number,
    pageSize: number,
    name?: string,
  ): Observable<Page<StudentSimpleModel>> {
    return this.http.get<Page<StudentSimpleModel>>('Student', {
      subjectAgeGroupId,
      pageNumber,
      pageSize,
      name: name || undefined,
    });
  }
}
