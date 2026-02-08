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
import { GenericDialog } from '../../../shared/components/dialogs/generic-dialog/generic-dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatOption } from "@angular/material/select";
import { debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';
import { AcademicYearSemesterAutoComplete } from '../../shared/components/academic-year-semester-auto-complete/academic-year-semester-auto-complete';
import { StudentParentVisitHistoryEndpoints } from '../../shared/endpoints/student-parent-visit-history-endpoint copy';
import { ParentVisitItem, ParentVisitStatistics } from '../../shared/endpoints/models/student-parent-visit-history/student-parent-visit-history-response';
import { StudentParentVisitDialog } from './dialog/student-parent-visit-dialog/student-parent-visit-dialog';
import { SeverityService } from '../../../../core/enums/service/severity-service';

@Component({
  selector: 'app-student-ParentVisit-component',
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
    MatSelect,
    MatOption,
    AcademicYearSemesterAutoComplete
],
  templateUrl: './student-parent-visit-history.html',
})

export class StudentParentVisitHistory{
  // ############# injections #############
  language = inject(Language);
  dialog = inject(MatDialog);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  httpHelper = inject(HttpHelper);
  matSnackBar = inject(MatSnackBar);
  parmas = inject(ParamsService);
  studentParentVisitEndpoints = inject(StudentParentVisitHistoryEndpoints)
  fb = inject(FormBuilder);
  severityService = inject(SeverityService);

  // ############# data #############
  filter = signal<{pageSize:number, pageNumber:number}>({
    pageSize: +(this.activatedRoute.snapshot.paramMap.get('pageSize') ?? 10),
    pageNumber: +(this.activatedRoute.snapshot.paramMap.get('pageNumber') ?? 1)
  });
  
  studentParentVisitStatistics = signal<ParentVisitStatistics>({
    completedParentVisitCount: 0,
    pendingParentVisitCount: 0
  });
  
  studentParentVisit = signal<ParentVisitItem[]>([]);
  
  headerTable:string[] = ['description','severity','isVisited','recordedAt','visitedAt','actions'];
  
  studentId!:number;
  
  classId!:number;
  
  loading= signal<boolean>(true);
  
  totalPages= signal<number>(0);

  form!: FormGroup;

  constructor(){
    this.form = this.fb.group({
      'isVisited':[false],
      'semester':[null],
      'semesterId':[null]
    });
    this.studentId = +(this.activatedRoute.snapshot.paramMap.get('id')??'0');
    this.classId = +(this.activatedRoute.snapshot.paramMap.get('classId')??'0');

    this.form.patchValue({type: this.parmas.loadGenericFromUrl()['type'] ?? '0'});
    
    this.filter.set({
      pageSize: +(this.parmas.loadGenericFromUrl()['pageSize'] ?? this.filter().pageSize),
      pageNumber: +(this.parmas.loadGenericFromUrl()['pageNumber'] ?? this.filter().pageNumber)
    });

    this.form.get('isVisited')!.valueChanges.pipe(
        debounceTime(100),  
        distinctUntilChanged(),
      ).subscribe(x=>{
        this.onLoading()
      });

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
    this.studentParentVisitEndpoints.get(
      this.studentId,
      this.form.value.semesterId,
      this.form.value.isVisited,
      this.filter().pageNumber,
      this.filter().pageSize)
        .subscribe({
          next:(success)=>{
            if(success.statistics)
              this.studentParentVisitStatistics.set(success.statistics);
            this.studentParentVisit.set(success.parentVisits.content); // content
            this.filter.set({
              pageSize: success.parentVisits.pageSize,
              pageNumber: success.parentVisits.pageNumber
            });

            this.totalPages.set(success.parentVisits.countPages) 

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
      StudentParentVisitDialog, 
      {
        width: "80%",
        data:{
          studentId: this.studentId
        }
      }
    );
    
    dialogRef.afterClosed().subscribe(result => {
      if(result)
        this.studentParentVisit.update(arr => [...arr, result.data]);
        this.changeStatistic(result.data.type,1);
    });
  }

  changeStatistic(visited: boolean , count:number){
    this.studentParentVisitStatistics.update(x=>{
          if(visited){
            return {...x, completedParentVisitCount: x.completedParentVisitCount + count}
          }else{
            return {...x, pendingParentVisitCount: x.pendingParentVisitCount + count}
          }
          return x;
        })
  }

  
  openUpdateDialog(studentParentVisit: ParentVisitItem){
    const dialogRef = this.dialog.open(
      StudentParentVisitDialog, 
      {
        width: "80%",
        data:{     
          studentId: this.studentId,
          studentParentVisit: studentParentVisit,
          semester: this.form.get('semester')?.value
        }
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.studentParentVisit.update(arr => 
          {
            arr = arr.map(x => x.id === result.data.id ? result.data : x);
            return arr;
          }
        );
        this.studentParentVisitStatistics.update(x=>{
          return x;
        })
        
      }
    });
  }

  openDeleteDialog(ParentVisit:ParentVisitItem){
    const dialogRef = this.dialog.open(
      DeleteDialog, 
      {
        data:{
          title:this.language.transform('delete_period'),
          action: ()=>{
            this.studentParentVisitEndpoints.delete(ParentVisit.id)
              .subscribe({
                next:success=>{
                  dialogRef.close();
                  this.studentParentVisit.update(x=> {
                    return x.filter(y=> y.id != success.id)
                  })
                  this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));

                  this.changeStatistic(ParentVisit.isVisited,-1);

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

  openConfirmDialog(id:number){
    const dialogRef = this.dialog.open(
      GenericDialog, 
      {
        data:{
          title: this.language.transform('confirm_parent_visit'),
          message: this.language.transform('do_you_want_confirm_parent_visit_question'),
          actionTitle: this.language.transform('release_to_parent'),
          style: "background-color :var(--mat-sys-success)",
          action: ()=>{
            this.studentParentVisitEndpoints.confirmVisit(id)
              .subscribe({
                next:success=>{
                  dialogRef.close();

                  this.studentParentVisit.update(arr =>
                      {
                        arr = arr.filter(x => x.id !== id);
                        return arr;
                      }
                    );

                  this.changeStatistic(false,+1);
                  this.changeStatistic(true,-1);

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
