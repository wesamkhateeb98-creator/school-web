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
import { DatePipe, JsonPipe } from "@angular/common";
import { AcademicYearSemesterAutoComplete } from "../../../../shared/components/academic-year-semester-auto-complete/academic-year-semester-auto-complete";
import { AuthService } from "../../../../../../core/services/auth-service";
import { StudentParentVisitHistoryEndpoints } from "../../../../shared/endpoints/student-parent-visit-history-endpoint copy";
import { SeverityService } from "../../../../../../core/enums/service/severity-service";
import { ParentVisitItem } from "../../../../shared/endpoints/models/student-parent-visit-history/student-parent-visit-history-response";

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
    AcademicYearSemesterAutoComplete
],
  providers:[provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './student-parent-visit-dialog.html',
})

export class StudentParentVisitDialog implements OnInit{
  // ##################### Injections #####################
    dialogRef = inject(MatDialogRef<StudentParentVisitDialog>);
    language = inject(Language);
    responsiveScreen = inject(ResponsiveScreen);
    fb = inject(FormBuilder);
    http = inject(HttpHelper);
    matSnackBar = inject(MatSnackBar);
    studentParentVisitEndpoints = inject(StudentParentVisitHistoryEndpoints);
    authService = inject(AuthService);
    severityService = inject(SeverityService)
    formatService = inject(FormatService);
    // ##################### data #####################
    loading = signal<boolean>(true);
    form!: FormGroup;
    key:string = crypto.randomUUID();
    data = inject(MAT_DIALOG_DATA);

  constructor(){
    this.form = this.fb.group(
      {
          severity: [ this.isUpdate()?this.data.studentParentVisit.severity:1],
          description: [ this.isUpdate()?this.data.studentParentVisit.description:'', [Validators.required, Validators.maxLength(1000)]],
          semesterId:[],
          semester:[]
      }
    );
    this.form.get('recordedAt')?.setValidators([this.dateBetweenValidator()]);
    this.form.patchValue({
      severity:this.isUpdate()?this.data.studentParentVisit.severity:1,
      description:this.isUpdate()?this.data.studentParentVisit.description:'', 
      recordedAt:this.isUpdate()?this.data.studentParentVisit.recordedAt:this.formatService.dateToUTCDateOnly(new Date())});

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
    if(!this.form.valid)
      return;
    this.loading.set(true);

    if(this.isUpdate()){
      this.updateStudentParentVisit();
    }else{
      this.addStudentParentVisit();    
    }
  }

addStudentParentVisit(){
  
  this.studentParentVisitEndpoints.add(
    this.key,
    this.form.value.severity,
    this.form.value.description,
    this.form.value.semesterId??0,
    this.data.studentId)
    .subscribe({
      next: (success) => {
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        const data = {
          id: success.id,
          description: this.form.value.description,
          isVisited: false,
          recordedAt: new Date(),
          recordedBy: null,
          visitedAt: null,
          verifiedBy: null,
          severity: this.form.value.severity
        } as ParentVisitItem;

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


  updateStudentParentVisit(){
    this.studentParentVisitEndpoints.update(
      this.data.studentParentVisit.id,
      this.form.value.severity,
      this.form.value.description,)
      .subscribe({
        next: success=>{
          this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
          const data = {
            ... this.data.studentParentVisit,
            id: success.id,
            description: this.form.value.description,
            recordedAt: new Date(),
            severity: this.form.value.severity
          } as ParentVisitItem;

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
    return this.data && this.data.studentParentVisit && this.data.studentParentVisit != null ;
  }
}

