import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../core/services/http-helper';
import { MutateResponse } from '../../shared/model/mutate-response';
import { Page } from '../../shared/model/page';
import { Observable } from 'rxjs';
import { StudentModel } from './models/student/student-model';
import { AddAdministrativeStaffViewModel } from '../pages/administrative-staff-page/view-model/add-administrative-staff-view-model';
import { AdministrativeStaffFilterViewModel } from '../pages/administrative-staff-page/view-model/administrative-staff-filter-view-model';
import { AdministrativeStaffModel } from './models/administrative-staff/administrative-staff-model';

@Injectable({
  providedIn: 'root',
})
export class AdministrativeStaffEndpoints {
  constructor(
    public http:HttpHelper
  ){}

  add(key: string, addModel: AddAdministrativeStaffViewModel): Observable<MutateResponse> {
  return this.http.post<MutateResponse>("administrative-staff", {
    "key": key,
    "fullName": addModel.fullName,
    "phoneNumber": addModel.phoneNumber,
    "permissions": addModel.permissions // Add this line
  });
}

update(administrativeStaffId: number, addModel: AddAdministrativeStaffViewModel): Observable<MutateResponse> {
  return this.http.put<MutateResponse>(`administrative-staff/${administrativeStaffId}`, {
    "fullName": addModel.fullName,
    "phoneNumber": addModel.phoneNumber,
    "permissions": addModel.permissions // Add this line
  });
}
  get(filter:AdministrativeStaffFilterViewModel):Observable<Page<AdministrativeStaffModel>>{
    return this.http.get<Page<AdministrativeStaffModel>>('administrative-staff',{
        name: filter.name,
        phoneNumber: filter.phonenumber,
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize
      })
  }

  delete(id:number): Observable<MutateResponse>{
    return this.http.delete<MutateResponse>(`administrative-staff/${id}`);
  }
  
}