import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../core/services/http-helper';
import { delay, Observable } from 'rxjs';
import { AccountCodeModel } from './models/Accounts/account-code-model';

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
}


