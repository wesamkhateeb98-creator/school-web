import { Component, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { AcademicYearViewModel } from './model/academic-year-view-model';
import { DatePipe } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCard } from "@angular/material/card";
import { Language } from '../../../../core/services/language';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddAcademicYearDialog } from './dialog/add-academic-year-dialog/add-academic-year-dialog';
import { Router } from '@angular/router';
import { AcademicYearFilterModel } from './model/academic-year-filter-model';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../core/consts';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParamsService } from '../../../../core/services/params-service';
import { DeleteDialog } from '../../../shared/components/dialogs/delete-dialog/delete-dialog';
import { AcademicYearEndpoints } from '../../shared/endpoints/academic-year-endpoints';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AssignSemesterToAcademicYear } from './dialog/assign-semester-to-academic-year/assign-semester-to-academic-year';
import { AcademicYearService } from '../../../../core/enums/service/academic-year-service';
import { AcademicYearStatus } from '../../../../core/enums/academic-year-status';
import { EndDialog } from './dialog/end-dialog/end-dialog';

@Component({
  selector: 'app-academic-year',
  imports: [
    MatTableModule,
    DatePipe,
    MatPaginatorModule,
    MatCard,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule
],
  templateUrl: './academic-year.html',
  styleUrl: './academic-year.scss',
})

export class AcademicYear{
  academicYearViewModel = signal<AcademicYearViewModel[]>([]);
  headerTable:string[] = ['academic','status','createdAt','Action'];
  loading = signal<boolean>(false);

  filter = signal<AcademicYearFilterModel>( {
      pageSize:10,
      selectedPage:1
    });
  totalPages= signal<number>(10);

  constructor(
    public language:Language, 
    public dialog :MatDialog,
    public router:Router,
    public academicYearEndpoints:AcademicYearEndpoints,
    public matSnackBar:MatSnackBar,
    public parmas:ParamsService,
    public academicYearService:AcademicYearService
  ){
    this.filter.update(x=>{
      const param = parmas.loadFromUrl<AcademicYearFilterModel>(this.filter());

      x.pageSize = param.pageSize? param.pageSize: 10;
      x.selectedPage = param.selectedPage? param.selectedPage: 1
      
      parmas.setToUrl(x);
      
      return x;
    });
    this.onLoading();
  }

  onLoading(){
    this.loading.set(true);
    
    this.academicYearEndpoints.get(
      this.filter().selectedPage,
      this.filter().pageSize
    ).subscribe({
      next:(success)=>{
        this.filter.update(x=>
        {
          x.pageSize = success.pageSize;
          x.selectedPage = success.pageNumber;  
          return x;
        });
        this.totalPages.set(success.countPages)
        this.academicYearViewModel.set(
          success.content.map(x=>({
            id: x.id,
            year: x.year,
            status:x.status,
            createdAt: x.createdAt
          } as AcademicYearViewModel)))
        this.loading.set(false);
      },
      error: (error)=>{
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      }
    })
  }
  
  openAddDialog(){
    const dialogRef = this.dialog.open(
      AddAcademicYearDialog, 
      {
        width: "80%"
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.academicYearViewModel.update(arr => [result.data, ...arr]);
        
      }
    });
  }

  openUpdateDialog(element: AcademicYearViewModel){
    const dialogRef = this.dialog.open(
      AddAcademicYearDialog, 
      {
        width: "80%",
        data:{     
          item:element
        }
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.academicYearViewModel.update(arr => 
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
          title:this.language.transform('delete_academic_year'),
          action: ()=>{
            this.academicYearEndpoints.delete(id).subscribe({
              next: success=>{
                dialogRef.close();
                this.academicYearViewModel.update(x=>{
                  return x.filter(item => item.id !== id);
                });
                this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));                        
              },
              error: error=>{
                this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
              }
            });
          }
        },
        width: "80%"
      }
    );
  }

  openEndDialog(id:number){
    const dialogRef = this.dialog.open(
      EndDialog, 
      {
        data:{
          title:this.language.transform('end_academic_year'),
          action: ()=>{
            this.academicYearEndpoints.end(id).subscribe({
              next: success=>{
                dialogRef.close();
                this.academicYearViewModel.update(x=>{
                  return x.map(item => item.id === id ? {...item,status: AcademicYearStatus.Ended} : item);
                });
                this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));                        
              },
              error: error=>{
                this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
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
          x.selectedPage = pageEvent.pageIndex + 1;  
          return x;
        });
      this.onLoading();
      this.parmas.setToUrl(this.filter())
  }  

  openDetailsDialog(academicYearId:number){
    this.dialog.open(
      AssignSemesterToAcademicYear, 
      {
        minWidth: '80vw',
        data:{
          academicYearId: academicYearId
        }
      }
    );
  }

}
