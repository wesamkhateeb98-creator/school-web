import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MutateResponse } from '../../../shared/model/mutate-response';
import { SubjectMarkDistributionModel } from './models/age-group/subject-mark-distribution-model';
import { SubjectMarkDistributionPageModel } from './models/age-group/subject-mark-distribution-page-model';

@Injectable({ providedIn: 'root' })
export class SubjectMarkDistributionEndpoints {
  constructor(public http: HttpHelper) {}

  add(subjectAgeGroupId: number, name: string, percentage: number, markType: number): Observable<MutateResponse> {
    return this.http.post<MutateResponse>('SubjectMarkDistribution', {
      subjectAgeGroupId,
      name,
      percentage,
      markType,
    });
  }

  update(id: number, name: string, percentage: number, markType: number): Observable<MutateResponse> {
    return this.http.put<MutateResponse>(`SubjectMarkDistribution/${id}`, {
      name,
      percentage,
      markType,
    });
  }

  delete(id: number): Observable<MutateResponse> {
    return this.http.delete<MutateResponse>(`SubjectMarkDistribution/${id}`);
  }

  get(subjectAgeGroupId: number, pageNumber: number, pageSize: number): Observable<SubjectMarkDistributionPageModel> {
    return this.http.get<SubjectMarkDistributionPageModel>('SubjectMarkDistribution', {
      subjectAgeGroupId,
      pageNumber,
      pageSize,
    });
  }
}
