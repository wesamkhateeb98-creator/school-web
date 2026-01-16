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
import { errorMatSnackbarConfig, successMatSnackbarConfig, time24hTo12 } from '../../../../core/consts';
import { DeleteDialog } from '../../../shared/components/dialogs/delete-dialog/delete-dialog';
import { SubjectEndpoints } from '../../shared/endpoints/subject-endpoint';
import { PeriodModel } from '../../shared/endpoints/models/Period/period-model';
import { PeriodFilterViewModel } from './model/period-filter-view-model';
import { PeriodEndpoints } from '../../shared/endpoints/period-endpoint';
import { AddPeriodDialog } from './dialog/add-subject-dialog/add-period-dialog';
import { AddSubjectDialog } from '../subject/dialog/add-subject-dialog/add-subject-dialog';
import { MatProgressBar } from "@angular/material/progress-bar";
import { PeriodViewModel } from './model/period-view-model';
import { ShiftPeriodDialog } from './dialog/shift-period-dialog/shift-period-dialog';

@Component({
  selector: 'app-semester-component',
  imports: [
    MatTableModule,
    DatePipe,
    MatPaginatorModule,
    MatCard,
    MatIconModule,
    MatButtonModule,
    MatProgressBar
],
  templateUrl: './period.html',
})
export class PeriodPage {
  periods = signal<PeriodViewModel[]>([]);
  headerTable:string[] = ['lessonNumber','FromTime','ToTime','createdAt','action'];
  ageGroupId!:number;

  loading= signal<boolean>(true);

  filter = signal<PeriodFilterViewModel>( {
      pageSize:10,
      pageNumber:1
    });

  totalPages= signal<number>(10);

  constructor(
    public language:Language, 
    public dialog :MatDialog,
    public router:Router,
    public httpHelper:HttpHelper,
    public matSnackBar:MatSnackBar,
    public parmas:ParamsService,
    public period:PeriodEndpoints
  ){
    this.onLoading();
  }

  onLoading(){
    this.loading.set(true);
    this.period.get(this.filter().pageNumber,this.filter().pageSize)
      .subscribe({
        next:(success)=>{
          this.filter.update(x=>
          {
            x.pageSize = success.pageSize;
            x.pageNumber = success.pageNumber;  
            return x;
          });

          this.totalPages.set(success.countPages)
          
          this.periods.set(success.content.map(item=> new PeriodViewModel(
            item.id,
            item.lessonNumber,
            time24hTo12(item.fromTime,this.language),
            time24hTo12(item.toTime,this.language),
            item.createdAt
          )))

          this.loading.set(false);
        },
        error:(error)=>{
          this.matSnackBar.open(error.message, this.language.transform('close'), successMatSnackbarConfig(this.language));
          this.loading.set(false);
        }
      })
  }

  openAddDialog(){
    const dialogRef = this.dialog.open(
      AddPeriodDialog, 
      {
        width: "80%"
      }
    );
    
    dialogRef.afterClosed().subscribe(result => {
      if(result)
        this.periods.update(arr => [...arr, result.data]);
    });
  }

  
  openUpdateDialog(period: PeriodModel){
    const dialogRef = this.dialog.open(
      AddPeriodDialog, 
      {
        width: "80%",
        data:{     
          period: period
        }
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.periods.update(arr => 
          {
            arr = arr.map(x => x.id === result.data.id ? result.data : x);
            return arr;
          }
        );
        
      }
    });
  }

  openDeleteDialog(id:number){
    const dialogRef = this.dialog.open(
      DeleteDialog, 
      {
        data:{
          title:this.language.transform('delete_period'),
          action: ()=>{
            this.period.delete(id)
              .subscribe({
                next:success=>{
                  dialogRef.close();
                  this.periods.update(x=>{
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
    
    this.setFilterToUrl();
    this.onLoading();
  }  

  setFilterToUrl() {
    this.parmas.setToUrl({
        'pageSize': this.filter().pageSize,
        'pageNumber': this.filter().pageNumber
      });
  }

  
  openShiftDialog(){
    const dialogRef = this.dialog.open(
      ShiftPeriodDialog, 
      {
        minWidth: "40%"
      }
    );
    
    dialogRef.afterClosed().subscribe(result => {
      if(result)
        this.onLoading();
    });
  }
}
