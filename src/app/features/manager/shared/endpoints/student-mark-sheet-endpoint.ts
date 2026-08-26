import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MutateResponse } from '../../../shared/model/mutate-response';
import { Page } from '../../../shared/model/page';
import { MarkSheetListFilter } from './models/student-mark-sheet/mark-sheet-list-filter';
import { MarkSheetListItem } from './models/student-mark-sheet/mark-sheet-list-item';
import { MarkSheetDetailResponse } from './models/student-mark-sheet/mark-sheet-detail-response';
import { MarkEntryUpsert } from './models/student-mark-sheet/mark-entry-upsert';
import { MarkSheetMatrixResponse } from './models/student-mark-sheet/mark-sheet-matrix-response';

@Injectable({ providedIn: 'root' })
export class StudentMarkSheetEndpoints {
  constructor(public http: HttpHelper) {}

  delete(id: number): Observable<MutateResponse> {
    return this.http.delete<MutateResponse>(`StudentMarkSheet/${id}`);
  }

  confirm(id: number): Observable<MutateResponse> {
    return this.http.put<MutateResponse>(`StudentMarkSheet/${id}/confirm`, {});
  }

  // ── أ-١ · التصديق وفتح للتعديل ────────────────────────────
  getFiltered(filter: MarkSheetListFilter): Observable<Page<MarkSheetListItem>> {
    return this.http.get<Page<MarkSheetListItem>>('StudentMarkSheet', {
      academicYearId: filter.academicYearId ?? undefined,
      academicYearSemesterId: filter.academicYearSemesterId ?? undefined,
      ageGroupId: filter.ageGroupId ?? undefined,
      classId: filter.classId ?? undefined,
      subjectAgeGroupId: filter.subjectAgeGroupId ?? undefined,
      status: filter.status ?? undefined,
      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize,
    });
  }

  getById(id: number): Observable<MarkSheetDetailResponse> {
    return this.http.get<MarkSheetDetailResponse>(`StudentMarkSheet/${id}`);
  }

  reopen(id: number): Observable<MutateResponse> {
    return this.http.put<MutateResponse>(`StudentMarkSheet/${id}/reopen`, {});
  }

  // ── و-١ · توليد الكشوف الناقصة ─────────────────────────────
  generate(academicYearSemesterId: number, ageGroupId: number, classId: number | null): Observable<{ count: number }> {
    return this.http.post<{ count: number }>('StudentMarkSheet/generate', {
      academicYearSemesterId,
      ageGroupId,
      classId,
    });
  }

  // ── و-٢ · شبكة الإدخال ─────────────────────────────────────
  saveEntries(id: number, entries: MarkEntryUpsert[]): Observable<{ count: number }> {
    return this.http.put<{ count: number }>(`StudentMarkSheet/${id}/entries`, { entries });
  }

  submit(id: number): Observable<MutateResponse> {
    return this.http.put<MutateResponse>(`StudentMarkSheet/${id}/submit`, {});
  }

  // ── و-٣ · مصفوفة المتابعة ──────────────────────────────────
  getMatrix(academicYearSemesterId: number, ageGroupId: number): Observable<MarkSheetMatrixResponse> {
    return this.http.get<MarkSheetMatrixResponse>('StudentMarkSheet/matrix', {
      academicYearSemesterId,
      ageGroupId,
    });
  }
}
