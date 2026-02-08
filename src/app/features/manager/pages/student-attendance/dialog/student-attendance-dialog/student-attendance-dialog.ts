import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators, ValueChangeEvent } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Language } from "../../../../../../core/services/language";
import { ResponsiveScreen } from "../../../../../../core/services/responsive-screen";
import { provideNativeDateAdapter, MatOption } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpHelper } from "../../../../../../core/services/http-helper";
import { errorMatSnackbarConfig, successMatSnackbarConfig, time12hTo24, time24hTo12 } from "../../../../../../core/consts";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { NgxMatTimepickerModule } from "ngx-mat-timepicker";
import { MatSelectModule } from "@angular/material/select";
import { FormatService } from "../../../../../../core/services/format-service";
import { ErrorTitleComponent } from "../../../../../shared/components/error-title-component/error-title-component";
import { DatePipe, formatDate } from "@angular/common";
import { AcademicYearSemesterAutoComplete } from "../../../../shared/components/academic-year-semester-auto-complete/academic-year-semester-auto-complete";
import { min } from "rxjs";
import { StudentAttendanceEndpoints } from "../../../../shared/endpoints/student-attendance-endpoint";
import { AuthService } from "../../../../../../core/services/auth-service";
import { StudentAttendanceTypeService } from "../../../../../../core/enums/service/student-attendance-type-service";
import { AttendanceItem } from "../../../../shared/endpoints/models/student-Attendance/student-Attendances-response";
import { StudentAttendanceFilterTypeService } from "../../../../../../core/enums/service/student-attendance-filter-type-service";

@Component({
  selector: 'app-add-academic-year-dialog',
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatTimepickerModule,
    NgxMatTimepickerModule,
    MatOption,
    MatSelectModule,
    ErrorTitleComponent,
    DatePipe,
    AcademicYearSemesterAutoComplete
],
  providers:[provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './student-attendance-dialog.html',
})

export class StudentAttendanceDialog implements OnInit{
  // ##################### Injections #####################
  dialogRef = inject(MatDialogRef<StudentAttendanceDialog>);
    language = inject(Language);
    responsiveScreen = inject(ResponsiveScreen);
    fb = inject(FormBuilder);
    http = inject(HttpHelper);
    matSnackBar = inject(MatSnackBar);
    studentAttendanceEndpoints = inject(StudentAttendanceEndpoints);
    authService = inject(AuthService);
    studentAttendanceType = inject(StudentAttendanceTypeService)
    formatService = inject(FormatService);
    // ##################### data #####################
    loading = signal<boolean>(true);
    form!: FormGroup;
    key:string = crypto.randomUUID();
    data = inject(MAT_DIALOG_DATA);

  constructor(){
    console.log(this.data);

    this.form = this.fb.group(
      {
          type: [ this.isUpdate()?this.data.studentAttendance.type:'1'],
          description: [ this.isUpdate()?this.data.studentAttendance.description:'', [Validators.required, Validators.maxLength(1000)]],
          recordedAt: [ this.isUpdate()?this.data.studentAttendance.recordedAt:'',[Validators.required]],
          semesterId:[],
          semester:[]
      }
    );
    this.form.get('recordedAt')?.setValidators([this.dateBetweenValidator()]);
    this.form.patchValue({
      type:this.isUpdate()?this.data.studentAttendance.type+"":'1',
      description:this.isUpdate()?this.data.studentAttendance.description:'', 
      recordedAt:this.isUpdate()?this.data.studentAttendance.recordedAt:this.formatService.dateToUTCDateOnly(new Date())});

    this.form.get('semester')?.valueChanges.subscribe(value => {
      if(this.form.get("semester")?.value){
        this.form.get('recordedAt')?.enable();
      }else{
        this.form.get('recordedAt')?.disable();
      }
    })

    this.loading.set(false);
  }

  async ngOnInit() {
    
  }
  
  // ##################### Validations #####################
  dateBetweenValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value || !this.form || !this.form.get("semester")?.value) return null; 

      let minDate = this.form.get("semester")?.value.startDate
      let maxDate = this.form.get("semester")?.value.endDate
      

      if (!minDate || !maxDate) {
        return { failedSemesterLoading: true };
      }

      const inputTime = new Date(value);
      inputTime.setHours(0, 0, 0, 0);
      const minTime = new Date(minDate);
      minTime.setHours(0, 0, 0, 0);
      const maxTime = new Date(maxDate);
      maxTime.setHours(0, 0, 0, 0);
      
      const today = new Date();
      maxTime.setHours(0, 0, 0, 0);

      if(inputTime > today)
        return {
          greaterThanDate:true
        }
        console.log({min,minTime,maxTime});
      if (inputTime >= minTime && inputTime <= maxTime) {
        return  null;
      }
      
      return { outRange: true };
    };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  submit(){
    console.log(this.form);
    if(!this.form.valid)
      return;
    console.log("valid")
    this.loading.set(true);

    if(this.isUpdate()){
      this.updateStudentAttendance();
    }else{
      this.addPeriod();    
    }
  }

addPeriod(){
  
  this.studentAttendanceEndpoints.add(
    this.key,
    this.form.value.type,
    this.form.value.description,
    this.formatService.ToDateOnly(this.form.value.recordedAt),
    this.form.value.semesterId??0,
    this.data.studentId
  )
    .subscribe({
      next: (success) => {
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        const data = {
          id:success.id,
          description: this.form.value.description,
          isReleased: this.data.studentAttendance.isReleased,
          recordedAt: this.form.value.recordedAt,
          type: this.form.value.type,
          isSolved: this.data.studentAttendance.isSolved,
          recordedBy: this.data.studentAttendance.recordedBy,
          releasedAt: this.data.studentAttendance.releasedAt,
          solvedAt: this.data.studentAttendance.solvedAt
        } as AttendanceItem;
        this.dialogRef.close({
          data
        });
      },
      error: (error) => {
        this.loading.set(false);
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
      }
    });
  }


  updateStudentAttendance(){
    this.studentAttendanceEndpoints.update(
      this.data.studentAttendance.id,
      this.form.value.type,
      this.form.value.description,
      this.formatService.ToDateOnly(this.form.value.recordedAt))
      .subscribe({
        next: success=>{
          this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
          const data = {
            id:success.id,
            description: this.form.value.description,
            isReleased: this.data.studentAttendance.isReleased,
            recordedAt: this.form.value.recordedAt,
            type: this.form.value.type,
            isSolved: this.data.studentAttendance.isSolved,
            recordedBy: this.data.studentAttendance.recordedBy,
            releasedAt: this.data.studentAttendance.releasedAt,
            solvedAt: this.data.studentAttendance.solvedAt
            } as AttendanceItem;
          this.dialogRef.close({
            data
          });
        },
        error: error=>{
          this.loading.set(false);
          this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        }
      });
  }

  isUpdate () : boolean{
    return this.data && this.data.studentAttendance && this.data.studentAttendance != null ;
  }
}

