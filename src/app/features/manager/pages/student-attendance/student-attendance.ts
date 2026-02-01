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
import { AttendanceItem, AttendanceStatistics } from '../../shared/endpoints/models/student-Attendance/student-Attendances-response';
import { StudentAttendanceEndpoints } from '../../shared/endpoints/student-attendance-endpoint';
import { StudentAttendanceDialog } from './dialog/student-attendance-dialog/student-attendance-dialog';
import { StudentAttendanceTypeService } from '../../../../core/enums/service/student-attendance-type-service';
import { StudentAttendanceFilterTypeService } from '../../../../core/enums/service/student-attendance-filter-type-service';

@Component({
  selector: 'app-student-attendance-component',
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
  templateUrl: './student-attendance.html',
})

export class StudentattendancePage implements OnInit{
  // ############# injections #############
  language = inject(Language);
  dialog = inject(MatDialog);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  httpHelper = inject(HttpHelper);
  matSnackBar = inject(MatSnackBar);
  parmas = inject(ParamsService);
  studentAttendanceEndpoints = inject(StudentAttendanceEndpoints)
  fb = inject(FormBuilder);
  studentAttendanceType = inject(StudentAttendanceTypeService);
  studentAttendanceFilterType = inject(StudentAttendanceFilterTypeService);

  // ############# data #############
  filter = signal<{pageSize:number, pageNumber:number}>({
    pageSize: +(this.activatedRoute.snapshot.paramMap.get('pageSize') ?? 10),
    pageNumber: +(this.activatedRoute.snapshot.paramMap.get('pageNumber') ?? 1)
  });
  
  studentAttendanceStatistics = signal<AttendanceStatistics>({
    absenceCount: 0,
    escapedCount: 0,
    excusedCount: 0,
    latenessCount: 0,
    presenceCount: 0,
    expelledCount: 0
  });
  
  studentAttendance = signal<AttendanceItem[]>([]);
  
  headerTable:string[] = ['type','description','recordedAt','isReleased','releasedAt','isSolved','solvedAt','actions'];
  
  studentId!:number;
  
  classId!:number;
  
  loading= signal<boolean>(true);
  
  totalPages= signal<number>(0);

  form!: FormGroup;

  constructor(){
    this.form = this.fb.group({
      'type':['0'],
      'semester':[null],
      'semesterId':[null],
      "semesterLoadFirst":[true]
    });
    this.studentId = +(this.activatedRoute.snapshot.paramMap.get('id')??'0');
    this.classId = +(this.activatedRoute.snapshot.paramMap.get('classId')??'0');

    this.form.patchValue({type: this.parmas.loadGenericFromUrl()['type'] ?? '0'});
    console.log(this.form.value)
    this.filter.set({
      pageSize: +(this.parmas.loadGenericFromUrl()['pageSize'] ?? this.filter().pageSize),
      pageNumber: +(this.parmas.loadGenericFromUrl()['pageNumber'] ?? this.filter().pageNumber)
    });
  }
  ngOnInit(): void {
    this.form.get('type')!.valueChanges.pipe(
        debounceTime(300),
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
    this.loading.set(true);
    this.studentAttendanceEndpoints.get(
      this.studentId,
      this.form.value.semesterId,
      this.form.value.type,
      this.filter().pageNumber,
      this.filter().pageSize)
        .subscribe({
          next:(success)=>{
            if(success.statistics)
              this.studentAttendanceStatistics.set(success.statistics);
            this.studentAttendance.set(success.attendances.content);
            this.filter.set({
              pageSize: success.attendances.pageSize,
              pageNumber: success.attendances.pageNumber
            });

            this.totalPages.set(success.attendances.countPages) 

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
      StudentAttendanceDialog, 
      {
        width: "80%",
        data:{
          studentId: this.studentId
        }
      }
    );
    
    dialogRef.afterClosed().subscribe(result => {
      if(result)
        this.studentAttendance.update(arr => [...arr, result.data]);
        this.changeStatistic(result.data.type,1);
    });
  }

  changeStatistic(type: number , count:number){
    this.studentAttendanceStatistics.update(x=>{
          if(type === 1){
            return {...x, presenceCount: x.presenceCount + count}
          }else if(type === 2){
            return {...x, latenessCount: x.latenessCount + count}
          }else if(type === 3){
            return {...x, absenceCount: x.absenceCount + count}
          }else if(type === 4){
            return {...x, escapedCount: x.escapedCount + count}
          }else if(type === 5){
            return {...x, excusedCount: x.excusedCount + count}
          }else if(type === 6){
            return {...x, expelledCount: x.expelledCount + count}
          }
          return x;
        })
  }

  
  openUpdateDialog(studentAttendance: AttendanceItem){
    const dialogRef = this.dialog.open(
      StudentAttendanceDialog, 
      {
        width: "80%",
        data:{     
          studentId: this.studentId,
          studentAttendance: studentAttendance,
          semester: this.form.get('semester')?.value
        }
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.studentAttendance.update(arr => 
          {
            arr = arr.map(x => x.id === result.data.id ? result.data : x);
            return arr;
          }
        );
        this.studentAttendanceStatistics.update(x=>{
          this.changeStatistic(result.data.type,+1);
          this.changeStatistic(studentAttendance.type,-1);
          return x;
        })
        
      }
    });
  }

  openDeleteDialog(attendance:AttendanceItem){
    const dialogRef = this.dialog.open(
      DeleteDialog, 
      {
        data:{
          title:this.language.transform('delete_period'),
          action: ()=>{
            this.studentAttendanceEndpoints.delete(attendance.id)
              .subscribe({
                next:success=>{
                  dialogRef.close();
                  this.studentAttendance.update(x=> {
                    return x.filter(y=> y.id != success.id)
                  })
                  this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));

                  this.changeStatistic(attendance.type,-1);

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

  openReleaseToParentDialog(id:number){
    const dialogRef = this.dialog.open(
      GenericDialog, 
      {
        data:{
          title: this.language.transform('release_to_parent'),
          message: this.language.transform('do_you_want_release_to_parent_question'),
          actionTitle: this.language.transform('release_to_parent'),
          style: "background-color :var(--mat-sys-success)",
          action: ()=>{
            this.studentAttendanceEndpoints.releaseToParent(id)
              .subscribe({
                next:success=>{
                  dialogRef.close();

                  this.studentAttendance.update(arr =>
                      {
                        arr = arr.map(x => x.id === id ? {...x, isReleased: true} : x);
                        return arr;
                      }
                    );

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

  openSolveeDialog(id:number){
    const dialogRef = this.dialog.open(
      GenericDialog, 
      {
        data:{
          title:this.language.transform('solve_attendance'),
          message: this.language.transform('do_you_want_solve_question'),
          actionTitle: this.language.transform('solve_attendance'),
          style: "background-color :var(--mat-sys-success)",
          action: ()=>{
            this.studentAttendanceEndpoints.solve(id)
              .subscribe({
                next:success=>{
                  dialogRef.close();
                 this.studentAttendance.update(arr =>
                      {
                        arr = arr.map(x => x.id === id ? {...x, isSolved: true} : x);
                        return arr;
                      }
                    );
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
