import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { SemsterViewModel } from './model/semster-view-model';
import { Language } from '../../../../core/services/language';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddSemesterDialog } from './dialog/add-semester-dialog/add-semester-dialog';
import { DeleteSemesterDialog } from './dialog/delete-semester-dialog/delete-semester-dialog';

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
  templateUrl: './semester.html',
  styleUrl: './semester.scss',
})
export class Semester {
  academicYearViewModel:SemsterViewModel[];
  headerTable:string[] = ['semester','startDate','endDate','createdAt','action'];
  academicYearId!:number;

  constructor(
    public language:Language, 
    public dialog :MatDialog,
    public router:Router,
    private route: ActivatedRoute
  ){
    this.academicYearId = Number(route.snapshot.paramMap.get('id'));
    this.academicYearViewModel = [
      new SemsterViewModel(
        1,
        "First semester", 
        new Date("2025-10-15T05:33:17.902Z"),
        new Date("2026-01-15T05:33:17.902Z"),
        new Date("2025-10-15T05:33:17.902Z")
      ),
      new SemsterViewModel(
        2,
        "Second semester", 
        new Date("2025-10-15T05:33:17.902Z"),
        new Date("2026-01-15T05:33:17.902Z"),
        new Date("2025-10-15T05:33:17.902Z")
      )
    ];
  }

  openAddDialog(){
    const dialogRef = this.dialog.open(
      AddSemesterDialog, 
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
      DeleteSemesterDialog, 
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
