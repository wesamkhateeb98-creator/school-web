import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../../../../core/services/http-helper';
import { PipelineResponse } from './models/results/pipeline-response';
import { GeneratePreviewResponse } from './models/results/generate-preview-response';
import { GenerateResponse } from './models/results/generate-response';
import { StudentResultListResponse } from './models/results/student-result-list-response';
import { StudentResultDetailResponse } from './models/results/student-result-detail-response';
import { DecisionRequest } from './models/results/decision-request';
import { PublishPreviewResponse } from './models/results/publish-preview-response';
import { PublishResponse } from './models/results/publish-response';

@Injectable({
  providedIn: 'root',
})
export class ResultsEndpoints {
  private readonly baseUrl = 'results';

  constructor(public http: HttpHelper) {}

  getPipeline(academicYearId: number, ageGroupId: number, academicYearSemesterId?: number | null): Observable<PipelineResponse> {
    return this.http.get<PipelineResponse>(`${this.baseUrl}/pipeline`, {
      academicYearId,
      ageGroupId,
      academicYearSemesterId: academicYearSemesterId ?? undefined,
    });
  }

  getGeneratePreview(academicYearId: number, ageGroupId: number, academicYearSemesterId?: number | null): Observable<GeneratePreviewResponse> {
    return this.http.get<GeneratePreviewResponse>(`${this.baseUrl}/generate/preview`, {
      academicYearId,
      ageGroupId,
      academicYearSemesterId: academicYearSemesterId ?? undefined,
    });
  }

  generate(academicYearId: number, ageGroupId: number, academicYearSemesterId: number | null): Observable<GenerateResponse> {
    return this.http.post<GenerateResponse>(`${this.baseUrl}/generate`, {
      academicYearId,
      ageGroupId,
      academicYearSemesterId,
    });
  }

  getStudents(
    academicYearId: number,
    ageGroupId: number,
    pageNumber: number,
    pageSize: number,
    classId?: number | null,
    computedStatus?: number | null,
    finalStatus?: number | null,
    name?: string | null,
  ): Observable<StudentResultListResponse> {
    return this.http.get<StudentResultListResponse>(`${this.baseUrl}/students`, {
      academicYearId,
      ageGroupId,
      classId: classId ?? undefined,
      computedStatus: computedStatus ?? undefined,
      finalStatus: finalStatus ?? undefined,
      name: name ?? undefined,
      pageNumber,
      pageSize,
    });
  }

  getStudentDetail(studentId: number, academicYearId: number): Observable<StudentResultDetailResponse> {
    return this.http.get<StudentResultDetailResponse>(`${this.baseUrl}/students/${studentId}`, {
      academicYearId,
    });
  }

  decide(studentId: number, request: DecisionRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/students/${studentId}/decision`, request);
  }

  getPublishPreview(academicYearId: number, ageGroupId: number, academicYearSemesterId: number): Observable<PublishPreviewResponse> {
    return this.http.get<PublishPreviewResponse>(`${this.baseUrl}/publish/preview`, {
      academicYearId,
      ageGroupId,
      academicYearSemesterId,
    });
  }

  publish(academicYearId: number, ageGroupId: number, academicYearSemesterId: number): Observable<PublishResponse> {
    return this.http.post<PublishResponse>(`${this.baseUrl}/publish`, {
      academicYearId,
      ageGroupId,
      academicYearSemesterId,
    });
  }
}
