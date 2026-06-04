import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../../../core/services/http-helper';
import { StaffProfileResponse } from './staff-profile-response';

@Injectable({ providedIn: 'root' })
export class StaffProfileEndpoint {
  constructor(private http: HttpHelper) {}

  getProfile(): Observable<StaffProfileResponse> {
    return this.http.get<StaffProfileResponse>('account/profile/administrative-staff');
  }
}
