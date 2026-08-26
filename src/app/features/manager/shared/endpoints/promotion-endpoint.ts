import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../../../../core/services/http-helper';
import { PromotionPreviewResponse } from './models/promotion/promotion-preview-response';
import { PromotionExecuteRequest } from './models/promotion/promotion-execute-request';
import { PromotionExecuteResponse } from './models/promotion/promotion-execute-response';
import { TransferLogResponse } from './models/promotion/transfer-log-response';

@Injectable({
  providedIn: 'root',
})
export class PromotionEndpoints {
  private readonly baseUrl = 'promotion';

  constructor(public http: HttpHelper) {}

  getPreview(academicYearId: number, ageGroupId?: number | null): Observable<PromotionPreviewResponse> {
    return this.http.get<PromotionPreviewResponse>(`${this.baseUrl}/preview`, {
      academicYearId,
      ageGroupId: ageGroupId ?? undefined,
    });
  }

  execute(request: PromotionExecuteRequest): Observable<PromotionExecuteResponse> {
    return this.http.post<PromotionExecuteResponse>(`${this.baseUrl}/execute`, request);
  }

  getTransferLog(studentId: number): Observable<TransferLogResponse> {
    return this.http.get<TransferLogResponse>(`${this.baseUrl}/students/${studentId}/log`);
  }
}
