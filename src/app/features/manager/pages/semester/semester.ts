import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { SemesterViewModel } from './model/semester-view-model';
import { Language } from '../../../../core/services/language';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddSemesterDialog } from './dialog/add-semester-dialog/add-semester-dialog';
import { DeleteSemesterDialog } from './dialog/delete-semester-dialog/delete-semester-dialog';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParamsService } from '../../../../core/services/params-service';
import { Page } from '../../../../shared/model/page';
import { SemesterFilterViewModel } from './model/semester-filter-view-model';
import { successMatSnackbarConfig } from '../../../../core/consts';

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
  semesterViewModels = signal<SemesterViewModel[]>([]);
  headerTable:string[] = ['semester','startDate','endDate','createdAt','action'];
  academicYearId!:number;

  filter = signal<SemesterFilterViewModel>( {
      pageSize:10,
      selectedPage:1
    });

    totalPages= signal<number>(10);

  constructor(
    public language:Language, 
    public dialog :MatDialog,
    route: ActivatedRoute,
    public router:Router,
    public httpHelper:HttpHelper,
    public matSnackBar:MatSnackBar,
    public parmas:ParamsService
  ){
    this.academicYearId = Number(route.snapshot.paramMap.get('id'));
    this.onLoading();
  }


  onLoading(){
    this.httpHelper.get<Page<SemesterViewModel>>('semester',{
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
        this.totalPages.set(success.countPages)
        this.semesterViewModels.set(success.content)
      },
      (error)=>{
        this.matSnackBar.open(error.error.Title, this.language.transform('close'), successMatSnackbarConfig);
      }
    )
  }

  openAddDialog(){
    const dialogRef = this.dialog.open(
      AddSemesterDialog, 
      {
        width: "80%",
        data:{     
          academicYearId: this.academicYearId
        }
      }
    );
    
    dialogRef.afterClosed().subscribe(result => {
      this.semesterViewModels.update(arr => [result.data, ...arr]);
    });
  }

  
    openUpdateDialog(semesterId: number){
      const dialogRef = this.dialog.open(
        AddSemesterDialog, 
        {
          width: "80%",
          data:{     
            academicYearId: this.academicYearId,
            semesterId: semesterId
          }
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.semesterViewModels.update(arr => 
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
