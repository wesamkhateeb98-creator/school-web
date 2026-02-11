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
import { MatChipSet, MatChip, MatChipRemove } from "@angular/material/chips";
import { MatIcon } from "@angular/material/icon";
import { dateInRange } from "../../../../../../core/validator/validator";

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
    MatSelectModule,
    ErrorTitleComponent,
    DatePipe,
    AcademicYearSemesterAutoComplete,
    MatChipSet,
    MatChip,
    MatIcon,
    MatChipRemove
],
  providers:[provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expel-dialog.html',
})

export class ExpelDialog{
  // ##################### Injections #####################
  dialogRef = inject(MatDialogRef<ExpelDialog>);
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
    this.form = this.fb.group(
      {
          description: [ '', [Validators.required, Validators.maxLength(1000)]],
          date: [ '',[Validators.required]],
          selectedDates: ['' ,[this.minArrayLength(1)]],
          semesterId:[],
          semester:[]
      }
    );
    this.form.get('date')?.setValidators([this.dateBetweenValidator()]);
    this.form.patchValue({
      type: '1',
      description: '', 
      date: new Date()});

    this.form.get('semester')?.valueChanges.subscribe(value => {
      if(this.form.get("semester")?.value){
        this.form.get('date')?.enable();
      }else{
        this.form.get('date')?.disable();
      }
    })

    this.loading.set(false);
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

      if (inputTime >= minTime && inputTime <= maxTime) {
        return  null;
      }
      
      return { outRange: true };
    };
  }

  minArrayLength(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const length = control.value ? control.value.length : 0;
      
      return length >= min ? null : { minLengthList: { actual: length, required: min } };
    };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  submit(){
    if(!this.form.valid)
      return;
    
    this.studentAttendanceEndpoints.expel(
      this.key,  
      this.selectedDates().map(x=> this.formatService.ToDateOnly(x)),
      this.form.value.description,
      this.form.value.semesterId??0, 
      this.data.studentId
    )
    .subscribe({
      next: (success) => {
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        
        const date = this.selectedDates().map(x=>{
          return {
            id:-1,
            type: 8,
            description: this.form.value.description,
            recordedAt: x,
            recordedBy: this.authService.getAuth()?.id,
            isReleased: false,
            isSolved: false,
            releasedAt: undefined,
            solvedAt: undefined
          } as AttendanceItem
        })

        this.dialogRef.close({
          data:date
        });
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
      }
    });
  }

  selectedDates = signal<Date[]>([])

  existsSelectedDate(){
    const date = this.form.value.date as Date;

    return this.selectedDates().findIndex(
      d => d.getTime() === date.getTime()) >= 0
  }

  selectDate() {
    const date = this.form.value.date as Date;
    if (!date) return;

    const index = this.selectedDates().findIndex(d => d.getTime() === date.getTime());

    if (index < 0) {
      this.selectedDates.update(x=>{
        x.push(date); 
        
        x.sort((a, b) => a.getTime() - b.getTime());

        return x ;
      });
      this.form.patchValue({
        selectedDates:this.selectedDates()
      });
    }
  }

  removeDate(dateToRemove: Date): void {
    this.selectedDates.update(x=>{
      return x.filter(
        date => date.getTime() !== dateToRemove.getTime()
      );
    });
    this.form.patchValue({
      selectedDates:this.selectedDates()
    });
  }
}

