import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Language } from '../../../../core/services/language';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParamsService } from '../../../../core/services/params-service';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../core/consts';
import { DeleteDialog } from '../../../shared/components/dialogs/delete-dialog/delete-dialog';
import { SubjectEndpoints } from '../../shared/endpoints/subject-endpoint';
import { PeriodModel } from '../../shared/endpoints/models/Period/period-model';
import { PeriodFilterViewModel } from './model/period-filter-view-model';

@Component({
  selector: 'app-semester-component',
  imports: [
    MatTableModule,
    DatePipe,
    MatPaginatorModule,
    MatCard,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './period.html',
})
export class PeriodPage {
  subjectViewModels = signal<PeriodModel[]>([]);
  headerTable:string[] = ['subject','description','createdAt','action'];
  ageGroupId!:number;

  filter = signal<PeriodFilterViewModel>( {
      pageSize:10,
      pageNumber:1
    });

  totalPages= signal<number>(10);

  constructor(
    public language:Language, 
    public dialog :MatDialog,
    route: ActivatedRoute,
    public router:Router,
    public httpHelper:HttpHelper,
    public matSnackBar:MatSnackBar,
    public parmas:ParamsService,
    public subjectEndpoints:SubjectEndpoints
  ){
    this.onLoading();
  }

  onLoading(){
    // this.subjectEndpoints.get(this.filter().pageNumber,this.filter().pageNumber,"")
    //   .subscribe({
    //     next:(success)=>{
    //       this.filter.update(x=>
    //       {
    //         x.pageSize = success.pageSize;
    //         x.pageNumber = success.pageNumber;  
    //         return x;
    //       });
    //       this.totalPages.set(success.countPages)
    //       this.subjectViewModels.set(success.content)
    //     },
    //     error:(error)=>{
    //       this.matSnackBar.open(error.error.Title, this.language.transform('close'), successMatSnackbarConfig(this.language));
    //     }
    //   })
  }

  openAddDialog(){
    // const dialogRef = this.dialog.open(
    //   AddSubjectDialog, 
    //   {
    //     width: "80%",
    //     data:{     
    //       ageGroupId: this.ageGroupId
    //     }
    //   }
    // );
    
    // dialogRef.afterClosed().subscribe(result => {
    //   if(result)
    //     this.subjectViewModels.update(arr => [result.data, ...arr]);
    // });
  }

  
  openUpdateDialog(periodModel: PeriodModel){
    // const dialogRef = this.dialog.open(
    //   AddSubjectDialog, 
    //   {
    //     width: "80%",
    //     data:{     
    //       ageGroupId: this.ageGroupId,
    //       subject: subjectViewModel
    //     }
    //   }
    // );
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     this.subjectViewModels.update(arr => 
    //       {
    //         arr = arr.map(x => x.id === result.data.id ? result.data : x);
    //         return arr;
    //       }
    //     );
        
    //   }
    // });
  }

  openDeleteDialog(id:number){
    const dialogRef = this.dialog.open(
      DeleteDialog, 
      {
        data:{
          title:this.language.transform('delete_subject'),
          action: ()=>{
            this.subjectEndpoints.delete(id)
              .subscribe({
                next:success=>{
                  dialogRef.close();
                  this.subjectViewModels.update(x=>{
                    return x.filter(item => item.id !== id);
                  })
                  this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
                },
                error: error=>{
                  this.matSnackBar.open(error.error.Title, this.language.transform('close'), errorMatSnackbarConfig(this.language));
                }
              });
            }  
        },
        width: "80%"
      }
    );
    
  }

  changeInPage(pageEvent:PageEvent){
    this.filter.update(x=>
        {
          x.pageSize = pageEvent.pageSize;
          x.pageNumber = pageEvent.pageIndex + 1;  
          return x;
        });
      this.onLoading();
      this.parmas.setToUrl(this.filter())
  }  
}
