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

  getCode(id:number):Observable<AccountCodeModel>{
    return this.http.get<AccountCodeModel>('account/code',{
        id:id,
      })
  }

  generateCode(id:number):Observable<AccountCodeModel>{
    return this.http.post<AccountCodeModel>('account/generate-code',{
        id:id
    });
  }

  assignStudent(accountId: number, classId: number, key: string, academicYearId: number) {
    return this.http.post(`account/assign/student/${accountId}/class/${classId}`, { key, academicYearId });
  }

  assignTeacher(accountId:number ,classId:number , key:string ){
    return this.http.post(`account/assign/teacher/${accountId}/class/${classId}`,{
      key:key
    });
  }

  unassingAccount(accountId:number ,accountClassAssignmentId:number){
    return this.http.delete(`account/unassign/account/${accountId}/assignment/${accountClassAssignmentId}`);
  }
}
