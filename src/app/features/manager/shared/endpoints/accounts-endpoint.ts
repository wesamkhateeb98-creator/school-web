import { Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { AccountCodeModel } from './models/Accounts/account-code-model';
import { HttpHelper } from '../../../../core/services/http-helper';

@Injectable({
  providedIn: 'root',
})
export class AccountsEndpoints {
  constructor(
    public http:HttpHelper
  ){}

  generateCode(id:number):Observable<AccountCodeModel>{
    return this.http.post<AccountCodeModel>('user/generate-code',{
        id:id
    });
  }

  assignStudent(accountId: number, classId: number, key: string, academicYearId: number) {
    return this.http.post(`user/assign/student/${accountId}/class/${classId}`, { key, academicYearId });
  }

  assignTeacher(accountId:number ,classId:number , key:string ){
    return this.http.post(`user/assign/teacher/${accountId}/class/${classId}`,{
      key:key
    });
  }

  unassingAccount(accountId:number ,accountClassAssignmentId:number){
    return this.http.delete(`user/unassign/account/${accountId}/assignment/${accountClassAssignmentId}`);
  }
}
