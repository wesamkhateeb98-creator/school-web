import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { AcademicYearViewModel } from './model/academic-year-view-model';
import { DatePipe } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCard } from "@angular/material/card";
import { Language } from '../../../../core/services/language';
import {  MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddAcademicYearDialog } from './dialog/add-academic-year-dialog/add-academic-year-dialog';
import { DeleteAcademicYear } from './dialog/delete-academic-year/delete-academic-year';
import { Router } from '@angular/router';
import { HttpHelper } from '../../../../core/services/http-helper';
import { AcademicYearFilterModel } from './model/academic-year-filter-model';
import { Page } from '../../../../shared/model/page';
import { AcademicYearModel } from './model/academic-year-model';
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

export class AcademicYear implements OnInit{
  academicYearViewModel!:AcademicYearViewModel[];
  headerTable:string[] = ['academic','createdAt','Action'];
  filter!:AcademicYearFilterModel;
  totalPages:number=1;

  constructor(
    public language:Language, 
    public dialog :MatDialog,
    public router:Router,
    public httpHelper:HttpHelper
  ){
    this.filter = {
      pageSize:20,
      selectedPage:2
    }
  }
  ngOnInit(): void {
    this.onLoading();
  }

  onLoading(){
    this.httpHelper.get<Page<AcademicYearModel>>('AcademicYearControlller',{
      PageNumber:this.filter.selectedPage,
      PageSize: this.filter.pageSize
    }).subscribe(
      (success)=>{
        // console.log(success);
      },
      (error)=>{
        
        // console.log(error);
      }
    )
    

    this.academicYearViewModel = [
      new AcademicYearViewModel(1,2022, new Date("2025-11-15T05:33:17.902Z")),
      new AcademicYearViewModel(2,2023, new Date("2025-11-15T05:33:17.902Z")),
      new AcademicYearViewModel(3,2024, new Date("2025-11-15T05:33:17.902Z")),
      new AcademicYearViewModel(4,2025, new Date("2025-11-15T05:33:17.902Z"))
    ];
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
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  openDeleteDialog(id:number){
    const dialogRef = this.dialog.open(
      DeleteAcademicYear, 
      {
        data:id,
        width: "80%"
      }
    );
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

}
