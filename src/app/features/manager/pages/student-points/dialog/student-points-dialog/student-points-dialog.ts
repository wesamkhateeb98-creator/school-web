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
import { AuthService } from "../../../../../../core/services/auth-service";
import { MatSelectModule } from "@angular/material/select";
import { FormatService } from "../../../../../../core/services/format-service";
import { ErrorTitleComponent } from "../../../../../shared/components/error-title-component/error-title-component";
import { DatePipe } from "@angular/common";
import { AcademicYearSemesterAutoComplete } from "../../../../shared/components/academic-year-semester-auto-complete/academic-year-semester-auto-complete";
import { StudentPointEndpoints } from "../../../../shared/endpoints/student-point-endpoint";
import { PointItem } from "../../../../shared/endpoints/models/student-point/student-points-response";
import { max } from "rxjs";

@Component({
  selector: 'app-student-points-dialog',
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
    AcademicYearSemesterAutoComplete
],
  providers:[provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './student-points-dialog.html',
})
// StudentpointsEndpoints

export class StudentPointsDialog{
  // ##################### Injections #####################
  dialogRef = inject(MatDialogRef<StudentPointsDialog>);
    language = inject(Language);
    responsiveScreen = inject(ResponsiveScreen);
    fb = inject(FormBuilder);
    http = inject(HttpHelper);
    matSnackBar = inject(MatSnackBar);
    studentPointEndpoints = inject(StudentPointEndpoints);
    authService = inject(AuthService);
    formatService = inject(FormatService);
    // ##################### data #####################
    loading = signal<boolean>(true);
    form!: FormGroup;
    key:string = crypto.randomUUID();
    data = inject(MAT_DIALOG_DATA);

  constructor() {
    
    this.form = this.fb.group(
      {
          points:['0',[Validators.required, Validators.min(1), Validators.max(1000)]],
          description: [ this.isUpdate()?this.data.studentPoint.description:'', [Validators.required, Validators.maxLength(1000)]],
          createdAt: [ this.isUpdate()?this.data.studentPoint.createdAt:'',[Validators.required, this.dateBetweenValidator()]],
          semesterId:[],
          semester:[]
      }
    );
    this.form.patchValue({
      points:this.isUpdate()?this.data.studentPoint.points:0,
      description:this.isUpdate()?this.data.studentPoint.description:'', 
      createdAt:this.isUpdate()?this.data.studentPoint.createdAt:''});
      
    this.form.get('semester')?.valueChanges.subscribe(value => {  
      if(this.form.get("semester")?.value){
        this.form.get('createdAt')?.enable();
      }else{
        this.form.get('createdAt')?.disable();
      }
    })

    this.loading.set(false);
  }
  
  // ##################### Validations #####################
  dateBetweenValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value || !this.form || !this.form.get("semester")?.value) return null; 
      console.log(this.form.value)

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
console.log(this.form.value)
      if(inputTime > today)
        return {
          greaterThanDate:true
        }
console.log(this.form.value)
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
    console.log(this.form.errors)
    if(!this.form.valid)
      return;
    
    this.loading.set(true);

    if(this.isUpdate()){
      this.updateStudentpoints();
    }else{
      this.addPeriod();    
    }
    
    this.loading.set(false);
  }

addPeriod(){
  this.studentPointEndpoints.add(
    this.key,
    this.form.value.points,
    this.form.value.description,
    this.data.studentId,
    this.form.value.semesterId??0,
    this.formatService.ToDateOnly(this.form.value.createdAt),
  )
    .subscribe({
      next: (success) => {
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        const data = {
          id:success.id,
          points: this.form.value.points,
          description: this.form.value.description,
          studentId: this.data.studentId,
          academicYearSemesterId: this.form.value.semesterId,
          createdAt: this.form.value.createdAt
        } as PointItem;
        this.dialogRef.close({
          data
        });
      },
      error: (error) => {
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
      }
    });
  }


  updateStudentpoints(){
    this.studentPointEndpoints.update(
      this.data.studentPoint.id,
      this.form.value.points,
      this.form.value.description,
      this.formatService.ToDateOnly(this.form.value.createdAt))
      .subscribe({
        next: success=>{
          this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
          const data = {
            id:success.id,
            points: this.form.value.points,
            description: this.form.value.description,
            studentId: this.data.studentId,
            academicYearSemesterId: this.form.value.semesterId,
            createdAt: this.form.value.createdAt
            } as PointItem;
          this.dialogRef.close({
            data
          });
        },
        error: error=>{
          
          this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        }
      });
  }

  isUpdate () : boolean{
    return this.data && this.data.studentPoint && this.data.studentPoint != null ;
  }
}

