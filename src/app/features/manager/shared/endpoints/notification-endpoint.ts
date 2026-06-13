import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../../../../core/services/http-helper';
import { Page } from '../../../shared/model/page';

export interface NotificationItem {
  id: number;
  message: string;
  createdAt: string;
  notificationType: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationEndpoint {
  constructor(private http: HttpHelper) {}

  get(pageNumber: number, pageSize: number): Observable<Page<NotificationItem>> {
    return this.http.get<Page<NotificationItem>>('notification', {
      PageNumber: pageNumber,
      PageSize: pageSize,
    });
  }
}
