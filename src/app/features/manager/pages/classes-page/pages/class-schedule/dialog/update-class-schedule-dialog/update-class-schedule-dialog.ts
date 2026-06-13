import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { ClassEndpoints } from '../../../../../../shared/endpoints/class-endpoint';
import { AgeGroupEndpoints } from '../../../../../../shared/endpoints/age-group-endpoint';
import { AcademicYearEndpoints } from '../../../../../../shared/endpoints/academic-year-endpoints';
import { Language } from '../../../../../../../../core/services/language';
import { AgeGroupModel } from '../../../../../../shared/endpoints/models/age-group/age-group-model';
import { AcademicYearModel } from '../../../../../academic-year/model/academic-year-model';
import { combineLatest, debounceTime, EMPTY, forkJoin, from, map, Observable, of, single, startWith, switchMap, tap } from 'rxjs';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../../../../core/consts';
import { DayDropDown } from "../../../../../../shared/components/day-drop-down/day-drop-down";
import { ScheduleClassDailyViewModel } from '../../model/class-schedule-view-model';
import { SubjectEndpoints } from '../../../../../../shared/endpoints/subject-endpoint';
import { PeriodEndpoints } from '../../../../../../shared/endpoints/period-endpoint';
import { TeacherEndpoints } from '../../../../../../shared/endpoints/teacher-endpoint';
import { Page } from '../../../../../../../shared/model/page';
import { TeacherModel } from '../../../../../../shared/endpoints/models/teacher/teacher-model';
import { SubjectAutoComplete } from "../../../../../../shared/components/subject-auto-complete/subject-auto-complete";
import { PeriodAutoComplete } from "../../../../../../shared/components/period-auto-complete/period-auto-complete";
import { TeacherAutoComplete } from "../../../../../../shared/components/teacher-auto-complete/teacher-auto-complete";
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { ThumbPosition } from '@angular/material/slider/testing';
import { ErrorTitleComponent } from "../../../../../../../shared/components/error-title-component/error-title-component";

@Component({
  selector: 'app-add-student-dialog',
  imports: [
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatDialogContent,
    MatGridList,
    MatDialogActions,
    MatGridTile,
    MatProgressBar,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatButtonModule,
    DayDropDown,
    SubjectAutoComplete,
    PeriodAutoComplete,
    TeacherAutoComplete,
    FormsModule,
    MatCheckboxModule,
    ErrorTitleComponent
],
  templateUrl: './update-class-schedule-dialog.html',
  providers:[
    provideNativeDateAdapter()
  ]
})
export class UpdateClassScheduleDialog implements OnInit {
  
  // ======================================== INJECTION ========================================
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UpdateClassScheduleDialog>);
  private data = inject(MAT_DIALOG_DATA);
  public language = inject(Language);
  public matSnackBar = inject(MatSnackBar);
  public classEndpoints = inject(ClassEndpoints);
  public subjectEndpoints = inject(SubjectEndpoints);
  public periodEndpoints = inject(PeriodEndpoints);
  public teacherEndpoints = inject(TeacherEndpoints);

  // ======================================== PREPARE DATA ========================================
  loading = signal<boolean>(true);
  form!: FormGroup;
  key: string = crypto.randomUUID();
  assignAll:boolean = false;
  // ======================================== Input Data ========================================

  classId:number = 0;
  classPeriod!:ScheduleClassDailyViewModel
  day:number = 0;

  ngOnInit() {
    this.form = this.fb.group({
      'day':['1'],
      'period':['',Validators.required],
      'periodId':[],
      'teacher':[],
      'teacherId':[],
      'subject':['',Validators.required],
      'subjectId':[],
      'assignAll':[false]
    });

    this.form.get('assignAll')!.valueChanges.subscribe({next: x=> this.assignAllWithTeacherValidatorLogic()})

    this.form.get('teacherId')!.valueChanges.subscribe({next: x=> this.assignAllWithTeacherValidatorLogic()})

    this.classId = this.data.classId;
    
    this.classPeriod = this.data.classPeriod;
    
    this.day = this.data.day;
    forkJoin({
      subject: this.subjectEndpoints.get(1,1,this.classPeriod.subjectName),
      period: this.periodEndpoints.getById(this.classPeriod.periodId),
      teacher: this.classPeriod.teacherName? 
        this.teacherEndpoints.get({
          pageNumber:1,
          pageSize:1,
          name: this.classPeriod.teacherName
        }):of(null),
    }).subscribe({
      next:x=>{
        this.loading.set(false);
        this.form.patchValue({
          day: this.day,
          period: x.period,
          periodId: x.period.id??undefined,
          teacher: x.teacher?.content[0]??undefined,
          teacherId: x.teacher?.content[0].id??undefined,
          subject: x.subject.content[0],
          subjectId: x.subject.content[0]?.id??undefined,
        })
      }
    })
  }

  // ======================================== Validation ========================================
  teacherValidation = signal<boolean>(true);

  assignAllWithTeacherValidatorLogic(){
    let assignAll:boolean = this.form.get('assignAll')?.value;
    let teacherId:boolean = this.form.get('teacherId')?.value;
    this.teacherValidation.set(!(assignAll && !teacherId))
  }

  // ======================================== Remove ========================================

  removeClassPeriod(){
    this.loading.set(true);
    const payload = {
      ageGroupId: this.form.value.ageGroupId,
      academicYearId: this.form.value.academicYearId,
      section: this.form.value.section
    };

    this.classEndpoints.deleteScheduleClass(this.classId,this.classPeriod.classScheduleId)
      .subscribe({
        next: (success) => {
          this.dialogRef.close({ data: success });
          this.matSnackBar.open(this.language.transform("success"), "OK", successMatSnackbarConfig(this.language));
        },
        error: (err) => {
          this.matSnackBar.open(err.error?.Title || err.message, "OK", errorMatSnackbarConfig(this.language));
          this.loading.set(false);
        }
      });
  }

  // ======================================== Update ========================================

  submit() {
    this.assignAllWithTeacherValidatorLogic()
    if (this.form.invalid || !this.teacherValidation()) return;
    this.loading.set(true);
    const payload = {
      ageGroupId: this.form.value.ageGroupId,
      academicYearId: this.form.value.academicYearId,
      section: this.form.value.section
    };

    let teacherId:(number | undefined) = this.form.value.teacherId;
    let periodId:(number) = this.form.value.periodId;
    let subjectId:(number) = this.form.value.subjectId;
    let day:(number) = this.form.value.day;
    let assignAll:boolean = this.form.value.assignAll;

    this.classEndpoints.updateScheduleClass(
      this.classId,
      this.classPeriod.classScheduleId,
      subjectId,
      day,
      periodId,
      assignAll,
      teacherId
    )
      .subscribe({
        next: (success) => {
          this.dialogRef.close({ data: success });
          this.matSnackBar.open(this.language.transform("success"), this.language.transform("ok"), successMatSnackbarConfig(this.language));
        },
        error: (err) => {
          this.matSnackBar.open(err.message || err.message, this.language.transform("ok"), errorMatSnackbarConfig(this.language));
          this.loading.set(false);
        }
      });
  }

  onNoClick() { this.dialogRef.close(); }
}