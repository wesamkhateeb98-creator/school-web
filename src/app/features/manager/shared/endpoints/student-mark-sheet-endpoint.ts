import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MutateResponse } from '../../../shared/model/mutate-response';
import { Page } from '../../../shared/model/page';
import { StudentMarkSheetModel } from './models/student-mark-sheet/student-mark-sheet-model';
import { MarkSheetReportResponse } from './models/student-mark-sheet/mark-sheet-report-response';

@Injectable({ providedIn: 'root' })
export class StudentMarkSheetEndpoints {
  constructor(public http: HttpHelper) {}

  add(key: string, subjectAgeGroupId: number, academicYearSemesterId: number): Observable<MutateResponse> {
    return this.http.post<MutateResponse>('StudentMarkSheet', {
      key,
      subjectAgeGroupId,
      academicYearSemesterId,
    });
  }

  update(id: number, subjectAgeGroupId: number, academicYearSemesterId: number): Observable<MutateResponse> {
    return this.http.put<MutateResponse>(`StudentMarkSheet/${id}`, {
      subjectAgeGroupId,
      academicYearSemesterId,
    });
  }

  delete(id: number): Observable<MutateResponse> {
    return this.http.delete<MutateResponse>(`StudentMarkSheet/${id}`);
  }

  get(
    academicYearSemesterId: number,
    subjectAgeGroupId: number | null,
    pageNumber: number,
    pageSize: number,
  ): Observable<Page<StudentMarkSheetModel>> {
    return this.http.get<Page<StudentMarkSheetModel>>('StudentMarkSheet', {
      AcademicYearSemesterId: academicYearSemesterId,
      SubjectAgeGroupId: subjectAgeGroupId ?? undefined,
      PageNumber: pageNumber,
      PageSize: pageSize,
    });
  }

  confirm(id: number): Observable<MutateResponse> {
    return this.http.put<MutateResponse>(`StudentMarkSheet/${id}/confirm`, {});
  }

  release(academicYearSemesterId: number): Observable<{ count: number }> {
    return this.http.put<{ count: number }>(`StudentMarkSheet/release/${academicYearSemesterId}`, {});
  }

  getReport(academicYearSemesterId: number): Observable<MarkSheetReportResponse> {
    return this.http.get<MarkSheetReportResponse>(`StudentMarkSheet/report/${academicYearSemesterId}`);
  }
}
