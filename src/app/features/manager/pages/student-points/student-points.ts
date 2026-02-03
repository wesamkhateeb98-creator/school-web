import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
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
import { MatProgressBar } from "@angular/material/progress-bar";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';
import { AcademicYearSemesterAutoComplete } from '../../shared/components/academic-year-semester-auto-complete/academic-year-semester-auto-complete';
import { StudentPointEndpoints } from '../../shared/endpoints/student-point-endpoint';
import { PointItem } from '../../shared/endpoints/models/student-point/student-points-response';
import { StudentPointsDialog } from './dialog/student-points-dialog/student-points-dialog';

@Component({
  selector: 'app-student-points',
  imports: [
    MatTableModule,
    DatePipe,
    MatPaginatorModule,
    MatCard,
    MatIconModule,
    MatButtonModule,
    MatProgressBar,
    MatTooltipModule,
    MatExpansionModule,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    AcademicYearSemesterAutoComplete
],
  templateUrl: './student-points.html',
})

export class StudentPointsPage implements OnInit{
  // ############# injections #############
  language = inject(Language);
  dialog = inject(MatDialog);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  httpHelper = inject(HttpHelper);
  matSnackBar = inject(MatSnackBar);
  parmas = inject(ParamsService);
  studentPointEndpoints = inject(StudentPointEndpoints)
  fb = inject(FormBuilder);

  // ############# data #############
  filter = signal<{pageSize:number, pageNumber:number}>({
    pageSize: +(this.activatedRoute.snapshot.paramMap.get('pageSize') ?? 10),
    pageNumber: +(this.activatedRoute.snapshot.paramMap.get('pageNumber') ?? 1)
  });
  
  totalPoints = signal<number>(0);
  
  studentpoints = signal<PointItem[]>([]);
  
  headerTable:string[] = ['points','description','createdAt','actions'];
  
  studentId!:number;
  
  classId!:number;
  
  loading= signal<boolean>(true);
  
  totalPages= signal<number>(0);

  form!: FormGroup;

  constructor(){
    this.form = this.fb.group({
      'semester':[null],
      'semesterId':[null],
      "semesterLoadFirst":[true]
    });
    this.studentId = +(this.activatedRoute.snapshot.paramMap.get('id')??'0');
    this.classId = +(this.activatedRoute.snapshot.paramMap.get('classId')??'0');
    
    this.filter.set({
      pageSize: +(this.parmas.loadGenericFromUrl()['pageSize'] ?? this.filter().pageSize),
      pageNumber: +(this.parmas.loadGenericFromUrl()['pageNumber'] ?? this.filter().pageNumber)
    });
  }
  ngOnInit(): void {
    this.form.get('semesterId')!.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
      ).subscribe(x=>{
        this.onLoading()
      });
  }

  onLoading(){
    if(!this.form.value.semesterId)
      return;
    
    this.loading.set(true);
    this.studentPointEndpoints.get(
      this.studentId,
      this.form.value.semesterId,
      this.filter().pageNumber,
      this.filter().pageSize)
        .subscribe({
          next:(success)=>{
            this.totalPoints.set(success.totalPoints);

            this.studentpoints.set(success.points.content);

            this.filter.set({
              pageSize: success.points.pageSize,
              pageNumber: success.points.pageNumber
            });

            this.totalPages.set(success.points.countPages) 

            this.setFilterToUrl();

            this.loading.set(false);
          },
          error:(error)=>{
            this.matSnackBar.open(error.message, this.language.transform('close'), successMatSnackbarConfig(this.language));
            this.loading.set(false);
          }
        })
  }

  // ############# dialogs #############

  openAddDialog(){
    const dialogRef = this.dialog.open(
      StudentPointsDialog, 
      {
        width: "80%",
        data:{
          studentId: this.studentId
        }
      }
    );
    
    dialogRef.afterClosed().subscribe(result => {
      if(result)
        this.studentpoints.update(arr => [...arr, result.data]);
        this.totalPoints.update(x=>{
            x += result.data.points;
            return x; 
          })
    });
  }

  
  openUpdateDialog(studentPoint: PointItem){
    const dialogRef = this.dialog.open(
      StudentPointsDialog, 
      {
        width: "80%",
        data:{     
          studentId: this.studentId,
          studentPoint: studentPoint,
          semester: this.form.get('semester')?.value
        }
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.studentpoints.update(arr => 
          {
            arr = arr.map(x => x.id === result.data.id ? result.data : x);
            return arr;
          }
        );
        console.log(result.data)
        this.totalPoints.update(x=>{
          x-= studentPoint.points;
          x+= result.data.points;
          return x;
        })
        
      }
    });
  }

  openDeleteDialog(point:PointItem){
    const dialogRef = this.dialog.open(
      DeleteDialog, 
      {
        data:{
          title:this.language.transform('delete_period'),
          action: ()=>{
            this.studentPointEndpoints.delete(point.id)
              .subscribe({
                next:success=>{
                  dialogRef.close();
                  this.studentpoints.update(x=> {
                    return x.filter(y=> y.id != success.id)
                  })
                  this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));

                  this.totalPoints.update(x=>{
                    x -= point.points
                    return x;
                  })
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

  // ################ Pagination ################

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
        'pageNumber': this.filter().pageNumber,
        'type': this.form.value.type
      });
  }

  backPage(){
    this.router.navigate(
      this.classId > 0 ? ['/manager/class',this.classId,'students']:['/manager/students']
    );
  }
}
