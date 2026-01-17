import { DatePipe } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Language } from '../../../../core/services/language';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHelper } from '../../../../core/services/http-helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParamsService } from '../../../../core/services/params-service';
import { ClassEndpoints } from '../../shared/endpoints/class-endpoint';
import { PeriodEndpoints } from '../../shared/endpoints/period-endpoint';
import { DayService } from '../../../../core/enums/service/day-service';
import { time24hTo12 } from '../../../../core/consts';
import { ClassScheduleTableSchema } from './model/class-schedule-table-schema';
import { forkJoin, Subject } from 'rxjs';
import { ScheduleClassViewModel } from './model/class-schedule-view-model';
import { ScheduleClassDailyModel, ScheduleClassModel } from "../../shared/endpoints/models/schedule-class/schedule-class-model";
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from "@angular/material/expansion";
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { DayDropDown } from "../../shared/components/day-drop-down/day-drop-down";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ResponsiveScreen } from '../../../../core/services/responsive-screen';
import { PeriodAutoComplete } from "../../shared/components/period-auto-complete/period-auto-complete";
import { SubjectAutoComplete } from "../../shared/components/subject-auto-complete/subject-auto-complete";
import { MatInputModule } from '@angular/material/input';
import { TeacherAutoComplete } from "../../shared/components/teacher-auto-complete/teacher-auto-complete";

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
    // MatFormField,
    // MatLabel,
    // MatAutocomplete,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    DayDropDown,
    PeriodAutoComplete,
    SubjectAutoComplete,
    TeacherAutoComplete
],
  templateUrl: './class-schedule.html'
})
export class ClassSchedulePage implements OnInit {

  // ======================================== INJECTION ========================================
  language = inject(Language);
  dialog = inject(MatDialog);
  route = inject(ActivatedRoute);
  router = inject(Router);
  httpHelper = inject(HttpHelper);
  matSnackBar = inject(MatSnackBar);
  parmas = inject(ParamsService);
  classEndpoints = inject(ClassEndpoints);
  periodEndpoints = inject(PeriodEndpoints);
  dayService = inject(DayService);
  responsive = inject(ResponsiveScreen);
  fb = inject(FormBuilder);

  // ======================================== INPUT PARAMETERS ========================================
  classId :number;

  // ======================================== EXPENDED ========================================

  expended = signal<boolean>(false)

  onExpended(selected:boolean){
    this.expended.set(selected); 
    if(selected)
      this.form.patchValue({period:undefined, subject: undefined, teacher: undefined})
  }

  // ======================================== TABLE VIEW MODEL ========================================
  columns = signal<ClassScheduleTableSchema[]>([]);
  displayedColumns= signal<string[]>([]);
  dataSource = signal<ScheduleClassViewModel[]>([]);

  dialyModel:ScheduleClassDailyModel[] = [];
  loading = signal<boolean>(false);

  // ======================================== TABLE VIEW MODEL ========================================
  
  form!: FormGroup;

  constructor(){
    this.form = this.fb.group({});
    this.classId = +(this.route.snapshot.paramMap.get('id')??'0');
    effect(x=>{
      this.displayedColumns.set(this.columns().map(x=>x.key))
    });
  }
  
  ngOnInit(): void {
    this.addColumn('day', this.language.transform('day_period_class_schedule_table'),0,true);
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
        },
        error: error=>{

        }
      });
      
    }  
  }

  prepareTable(){
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
    return element.items.find(x => x?.periodId === periodId)?.subjectName ?? null;
  }

  getTeacherName(element: ScheduleClassViewModel, periodId: number): string | null {
    if(periodId == 0){
      return null;
    }
    return element.items.find(x => x?.periodId === periodId)?.teacherName ?? null;
  }

  // ======================================== Navigation ========================================

  openPeriodPage(){
    this.router.navigate(['manager','classes','periods'])
  }

  operClassPage(){
    this.router.navigate(['manager','classes'])
  }
  

  // ======================================== ADD CLASS SCHEDULE ========================================

  
}
