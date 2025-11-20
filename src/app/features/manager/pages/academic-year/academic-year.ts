import { Component, OnInit, signal } from '@angular/core';
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
import { DeleteAcademicYear } from './dialog/delete-academic-year/delete-academic-year';
import { Router } from '@angular/router';
import { HttpHelper } from '../../../../core/services/http-helper';
import { AcademicYearFilterModel } from './model/academic-year-filter-model';
import { Page } from '../../../../shared/model/page';
import { AcademicYearModel } from './model/academic-year-model';
import { successMatSnackbarConfig } from '../../../../core/consts';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParamsService } from '../../../../core/services/params-service';


@Component({
  selector: 'app-academic-year',
  imports: [
    MatTableModule,
    DatePipe,
    MatPaginatorModule,
    MatCard,
    MatIconModule,
    MatButtonModule
],
  templateUrl: './academic-year.html',
  styleUrl: './academic-year.scss',
})

export class AcademicYear{
  academicYearViewModel = signal<AcademicYearViewModel[]>([]);
  headerTable:string[] = ['academic','createdAt','Action'];
  
  filter = signal<AcademicYearFilterModel>( {
      pageSize:10,
      selectedPage:1
    });
  totalPages= signal<number>(10);

  constructor(
    public language:Language, 
    public dialog :MatDialog,
    public router:Router,
    public httpHelper:HttpHelper,
    public matSnackBar:MatSnackBar,
    public parmas:ParamsService
  ){
    this.filter.update(x=>{
      const param = parmas.loadFromUrl<AcademicYearFilterModel>();

      x.pageSize = param.pageSize? param.pageSize: 10;
      x.selectedPage = param.selectedPage? param.selectedPage: 1
      
      parmas.setToUrl(x);
      
      return x;
    });
    this.onLoading();
  }


  onLoading(){
    this.httpHelper.get<Page<AcademicYearModel>>('AcademicYear',{
      PageNumber:this.filter().selectedPage,
      PageSize: this.filter().pageSize
    }).subscribe(
      (success)=>{
        this.filter.update(x=>
        {
          x.pageSize = success.pageSize;
          x.selectedPage = success.pageNumber;  
          return x;
        });
        //success.countPages
        this.totalPages.set(success.countPages)
        this.academicYearViewModel.set(success.content)
      },
      (error)=>{
        this.matSnackBar.open(error.error.Title, this.language.transform('close'), successMatSnackbarConfig);
      }
    )
  }

  openSemesterPage(academicYears:AcademicYearViewModel){
    this.router.navigate(['manager/academic_year',academicYears.id,'semester']);
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
      DeleteAcademicYear, 
      {
        data:{
          id:id,
          removeItem: (index:number)=>this.academicYearViewModel.update(x=>{
            return x.filter(item => item.id !== index);
          })
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
}
