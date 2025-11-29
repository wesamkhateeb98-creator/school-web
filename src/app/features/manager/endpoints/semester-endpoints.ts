import { Injectable } from '@angular/core';
import { HttpHelper } from '../../../core/services/http-helper';
import { MutateResponse } from '../../shared/model/mutate-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Language } from '../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../core/consts';
import { SemesterViewModel } from '../pages/semester/model/semester-view-model';
import { Page } from '../../shared/model/page';

@Injectable({
  providedIn: 'root',
})
export class SemesterEndpoints {
  constructor(
    public http:HttpHelper, 
    public matSnackBar:MatSnackBar,
    public language:Language
  ){}

  add(key:string, name:string): SemesterViewModel|null{
    this.http.post<MutateResponse>("semester",{
      key:key,
      name:name,
      
    }).subscribe({
      next: (success) => {
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        const data = new SemesterViewModel(
          success.id,
          name,
          new Date());
        return data;
      },
      error: (error) => {
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
      }
    });

    return null;
  }

  update(semesterId:number, name:string): SemesterViewModel|null{
    this.http.put<MutateResponse>("semester/" + semesterId,{
      name:name
    }).subscribe({
      next: success=>{
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        const data = new SemesterViewModel(
          success.id,
          name,
          new Date());
        return data;
      },
      error: error=>{
        this.matSnackBar.open(error.error.Title, this.language.transform('close'), errorMatSnackbarConfig(this.language));
      }
    });
    return null;
  }

  get(selectedPage:number,pageSize:number,name?:string):Page<SemesterViewModel> | null{
    this.http.get<Page<SemesterViewModel>>('semester',{
        PageNumber: selectedPage,
        PageSize: pageSize,
        name:name
      }).subscribe({
        next:(success)=>{
          this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
          return success;
        },
        error:(error)=>{
          this.matSnackBar.open(error.error.Title, this.language.transform('close'), successMatSnackbarConfig(this.language));
        }
    })
    return null;
  }

  delete(id:number):number | null{
    this.http.delete<MutateResponse>("semester/"+id).subscribe(
      success=>{
        this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
        return id;
      },
      error=>{
        this.matSnackBar.open(error.error.Title, this.language.transform('close'), errorMatSnackbarConfig(this.language));
      }
    );
    return null;
  }  
}
