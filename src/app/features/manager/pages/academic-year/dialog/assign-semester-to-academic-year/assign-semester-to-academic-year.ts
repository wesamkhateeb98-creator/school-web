import { Component, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AddAcademicYearDialog } from '../add-academic-year-dialog/add-academic-year-dialog';
import { Language } from '../../../../../../core/services/language';
import { SemesterForAcademicYearViewModel } from '../../model/semester-for-academic-year-view-model';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {  MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { DatePipe } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { SemesterForAcademicYearFilter } from '../../model/semester-for-academic-year-filter';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParamsService } from '../../../../../../core/services/params-service';

@Component({
  selector: 'app-assign-semester-to-academic-year',
  imports: [
    MatTableModule,
    DatePipe,
    MatPaginatorModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule
],
  templateUrl: './assign-semester-to-academic-year.html',
  styleUrl: './assign-semester-to-academic-year.scss',
})
export class AssignSemesterToAcademicYear {
  semesterForAcademicYear = signal<SemesterForAcademicYearViewModel[]>([]);
  loading = signal<boolean>(false);

  headerTable:string[] = ['startDate','endDate','semesterName','createdAt','Action'];

  filter = signal<SemesterForAcademicYearFilter>( {
      pageSize:10,
      selectedPage:1
    });
  totalPages= signal<number>(10);


  constructor(
    public dialogRef:MatDialogRef<AddAcademicYearDialog>,
    public language:Language,
    public matSnackBar:MatSnackBar,
    public parmas:ParamsService
  ){}

  onLoading(){

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
  
  openDeleteDialog(id:number){
    
  }

}
