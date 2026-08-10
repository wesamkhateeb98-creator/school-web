import { DatePipe } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Language } from '../../../../../../core/services/language';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParamsService } from '../../../../../../core/services/params-service';
import { ClassEndpoints } from '../../../../shared/endpoints/class-endpoint';
import { PeriodEndpoints } from '../../../../shared/endpoints/period-endpoint';
import { DayService } from '../../../../../../core/enums/service/day-service';
import { errorMatSnackbarConfig, successMatSnackbarConfig, time24hTo12 } from '../../../../../../core/consts';
import { AddClassScheduleTableSchema, ClassScheduleTableSchema } from './model/class-schedule-table-schema';
import { forkJoin, Subject } from 'rxjs';
import { ScheduleClassDailyViewModel, ScheduleClassViewModel } from './model/class-schedule-view-model';
import { ScheduleClassDailyModel, ScheduleClassModel } from "../../../../shared/endpoints/models/schedule-class/schedule-class-model";
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from "@angular/material/expansion";
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { DayDropDown } from "../../../../shared/components/day-drop-down/day-drop-down";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResponsiveScreen } from '../../../../../../core/services/responsive-screen';
import { PeriodAutoComplete } from "../../../../shared/components/period-auto-complete/period-auto-complete";
import { SubjectAutoComplete } from "../../../../shared/components/subject-auto-complete/subject-auto-complete";
import { MatInputModule } from '@angular/material/input';
import { TeacherAutoComplete } from "../../../../shared/components/teacher-auto-complete/teacher-auto-complete";
import { AddClassScheduleViewModel } from './model/add-class-schedule.view.model';
import { PeriodViewModel } from '../period/model/period-view-model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UpdateClassScheduleDialog } from './dialog/update-class-schedule-dialog/update-class-schedule-dialog';
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-class-schedule-component',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatGridList,
    MatGridTile,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    DayDropDown,
    SubjectAutoComplete,
    TeacherAutoComplete,
    MatButtonModule,
    PeriodAutoComplete,
    MatSlideToggleModule,
    MatProgressBar,
    MatTooltipModule
],
  templateUrl: './class-schedule.html'
})
export class ClassSchedulePage implements OnInit {

  // ======================================== INJECTION ========================================
  language = inject(Language);
  dialog = inject(MatDialog);
  route = inject(ActivatedRoute);
  router = inject(Router);
  matSnackBar = inject(MatSnackBar);
  parmas = inject(ParamsService);
  classEndpoints = inject(ClassEndpoints);
  periodEndpoints = inject(PeriodEndpoints);
  dayService = inject(DayService);
  responsive = inject(ResponsiveScreen);
  fb = inject(FormBuilder);

  // ======================================== INPUT PARAMETERS ========================================
  classId :number;

  // ======================================== TABLE VIEW MODEL ========================================
  columns = signal<ClassScheduleTableSchema[]>([]);
  displayedColumns= signal<string[]>([]);
  dataSource = signal<ScheduleClassViewModel[]>([]);

  dialyModel:ScheduleClassDailyModel[] = [];
  loading = signal<boolean>(false);
  tableLoading = signal<boolean>(false);

  // ======================================== TABLE VIEW MODEL ========================================
  
  form!: FormGroup;

  constructor(){
    this.form = this.fb.group({
      'teacher':[''],
      'period':['',Validators.required],
      'subject':['',Validators.required],
      'day':['1']
    });
    this.classId = +(this.route.snapshot.paramMap.get('id')??'0');
    effect(x=>{
      this.displayedColumns.set(this.columns().map(x=>x.key))
    });
  }
  
  ngOnInit(): void {
    this.onLoading();
  }

  // ======================================== Table LOGIC ( LOAD PERIOD + CLASS_SCHEDULE ) THEN PRESENT IT IN TABLE ========================================

  addColumn(key: string, label: string, id:number ,sticky:boolean = false, stickyEnd:boolean = false) {
    this.columns.update(cols => [
      ...cols,
      { key, label ,id:id,sticky:sticky,stickyEnd:stickyEnd}
    ]);
  }


  onLoading(){
    this.loading.set(true);
    this.tableLoading.set(true);
    this.dialyModel =[];
    this.columns.set([]);
    this.addColumn('day', this.language.transform('day_period_class_schedule_table'),0,true);
    if(this.classId > 0)
    {
      forkJoin({
        period: this.periodEndpoints.get(1,10000),
        classSchedule: this.classEndpoints.getScheduleClass(this.classId)
      }).subscribe({
        next: x=>{
          // period success
          x.period.content.forEach(x=> {
            this.addColumn(`key-${x.id}`, ` ${this.language.transform('class_period')}-${x.lessonNumber} ( ${time24hTo12(x.fromTime,this.language)} => ${time24hTo12(x.toTime,this.language)} )`,x.id);
          })
          this.columns.update(x=>{
            x[x.length-1].stickyEnd = true;
            return x;
          })

          // class schedule success
          this.dialyModel = x.classSchedule.classSchedules.sort((a,b)=>a.day - b.day);
          this.prepareTable();
          this.loading.set(false);
          this.tableLoading.set(false);
        },
        error: error=>{
          this.matSnackBar.open(error.message || "Error", this.language.transform('close'), errorMatSnackbarConfig(this.language));
          this.loading.set(false);
          this.tableLoading.set(false);
        }
      });

    }
  }

  prepareTable(){

    this.dataSource.set([])
    const periodIds = this.columns().map(x=>x.id); 
    
    this.dataSource.update(arr => {
      this.dialyModel.forEach(x=>{
        arr.push(new ScheduleClassViewModel(periodIds,x))
      })
      return arr;
    })
  }

  getSubjectName(element: ScheduleClassViewModel, periodId: number): string | null {
    if(periodId == 0){
      return this.dayService.getDaysById(element.day)?.name??null;
    }
    let classPeriod = element.items.find(x => x?.periodId === periodId);
    return classPeriod != null? classPeriod.subjectName : "";
  }

  getTeacherName(element: ScheduleClassViewModel, periodId: number): string | null {
    if(periodId == 0){
      return null;
    }
    let classPeriod = element.items.find(x => x?.periodId === periodId);
    return classPeriod != null && classPeriod.teacherName? `( ${classPeriod.teacherName} )` : "";
  }

  // ======================================== Navigation ========================================

  operClassPage(){
    this.router.navigate(['manager','class',this.classId,'info'])
  }

  // ======================================== Expanded ========================================

  expanded = signal<boolean>(false);
  onExpandedChange(value: boolean) {
    this.expanded.set(value);
  }

  // ======================================== ADD CLASS SCHEDULE ========================================
  
  displayedAddColumns= ['subject','period','teacher','action'];
  addViewModel = signal<AddClassScheduleViewModel[]>([]) ;
  day: number = 0;
  key: string = crypto.randomUUID();

  addToTable(){
    if (this.form.invalid){
      this.form.markAllAsTouched();
       return;
    }

    let teacherId:(number | undefined) = this.form.value.teacherId;
    let periodId:(number) = this.form.value.periodId;
    let subjectId:(number) = this.form.value.subjectId;
    let day:(number) = this.form.value.day;

    let existDay = this.dialyModel.find(x=>x.day == day)
    
    if(existDay){
      let classPeriod = existDay.items.find(x=>x.periodId == periodId)
      if(classPeriod)
      {
        this.matSnackBar.open(this.language.transform('class_period_exists_in_table'), this.language.transform('close'), errorMatSnackbarConfig(this.language));
        return;
      }
    }

    if(this.addViewModel().find(x=>x.period.id == periodId)){
      this.matSnackBar.open(this.language.transform('class_period_exists_in_added_table'), this.language.transform('close'), errorMatSnackbarConfig(this.language));
      return;
    }

    //add
    this.addViewModel.update(x=>[
      {
        subject:this.form.value.subject,
        period: this.form.value.period,
        teacher: this.form.value.teacher,
      },
      ...x,
    ]) 
    this.disableField()
  }

  disableField(){
    if(this.addViewModel().length > 0){

      this.form.get('day')?.disable();

    }else{
      this.form.get('day')?.enable();
    }
  }

  deleteFromAddClassSchedule(item:AddClassScheduleViewModel){
    this.addViewModel.update(x=>x.filter(x=>
    !(x.subject.id == item.subject.id &&
      x.period.id == item.period.id &&
      x.teacher.id == item.teacher.id)
    ));
    this.disableField()
  }
  
  show(period:PeriodViewModel)
  {
    return `${this.language.transform('class_period')}-${period.lessonNumber} ( ${time24hTo12(period.fromTime,this.language)} => ${time24hTo12(period.toTime,this.language)} )`
  }

  addClassSchedule(){
    this.loading.set(true);
    this.tableLoading.set(true);
    this.classEndpoints.addScheduleClass(
      this.key,
      this.classId,
      this.form.getRawValue().day,
      this.addViewModel().map(x=>({
        subjectId:x.subject.id,
        periodId:x.period.id,
        teacherId:x.teacher.id
      }))
    ).subscribe({
      next:()=>{
        this.matSnackBar.open(this.language.transform("success"), "OK", successMatSnackbarConfig(this.language));
        
        this.addViewModel.set([]);
        
        this.key = crypto.randomUUID();

        this.form.patchValue({
          period:undefined,
          periodId:undefined,
          teacher:undefined,
          teacherId:undefined,
          subject:undefined,
          subjectId:undefined,
        })

        this.onLoading()

        this.disableField()

        this.expanded.set(false);
      },
      error:(error) => {
        this.loading.set(false);
        this.matSnackBar.open(error.message || "Error", this.language.transform('close'), errorMatSnackbarConfig(this.language));
      }
    })
  }

  // ======================================== UPDATE CLASS SCHEDULE ========================================
  updateMode = signal<boolean>(false);

  changeUpdateMode(mode:boolean)
  {
    this.updateMode.set(mode);
  }

   enableUpdateButtonInTable(element: ScheduleClassViewModel, periodId: number): boolean {
    let classPeriod = element.items.find(x => x?.periodId === periodId);
    return classPeriod != null && this.updateMode();
  }

  update(element: ScheduleClassViewModel, periodId: number){
    let classPeriod = element.items.find(x => x?.periodId === periodId);
    const dialogRef = this.dialog.open(UpdateClassScheduleDialog, {
          width: "80vw",
          maxWidth: "80vw",
          autoFocus:false,
          data: { 
            classId: this.classId,
            classPeriod: classPeriod,
            day: element.day
          }
        });
    
        dialogRef.afterClosed().subscribe((result) => {
          if (result) this.onLoading();
        });
  }
}
// Day column