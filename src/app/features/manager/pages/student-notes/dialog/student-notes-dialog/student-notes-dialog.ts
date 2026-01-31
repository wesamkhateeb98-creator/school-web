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
import { StudentNoteEndpoints } from "../../../../shared/endpoints/student-note-endpoint";
import { NoteItem } from "../../../../shared/endpoints/models/student-note/student-notes-response";
import { AuthService } from "../../../../../../core/services/auth-service";
import { StudentNoteTypeService } from "../../../../../../core/enums/service/student-note-type-service";
import { MatSelectModule } from "@angular/material/select";
import { FormatService } from "../../../../../../core/services/format-service";
import { ErrorTitleComponent } from "../../../../../shared/components/error-title-component/error-title-component";
import { DatePipe, formatDate } from "@angular/common";
import { AcademicYearSemesterAutoComplete } from "../../../../shared/components/academic-year-semester-auto-complete/academic-year-semester-auto-complete";
import { min } from "rxjs";

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
  templateUrl: './student-notes-dialog.html',
})
// StudentNoteEndpoints

export class StudentNotesDialog implements OnInit{
  // ##################### Injections #####################
  dialogRef = inject(MatDialogRef<StudentNotesDialog>);
    language = inject(Language);
    responsiveScreen = inject(ResponsiveScreen);
    fb = inject(FormBuilder);
    http = inject(HttpHelper);
    matSnackBar = inject(MatSnackBar);
    studentNoteEndpoints = inject(StudentNoteEndpoints);
    authService = inject(AuthService);
    studentNoteType = inject(StudentNoteTypeService)
    formatService = inject(FormatService);
    // ##################### data #####################
    loading = signal<boolean>(true);
    form!: FormGroup;
    key:string = crypto.randomUUID();
    data = inject(MAT_DIALOG_DATA);

  async ngOnInit() {
    
    this.form = this.fb.group(
      {
          type: [ this.isUpdate()?this.data.studentNote.type:'1'],
          description: [ this.isUpdate()?this.data.studentNote.description:'', [Validators.required, Validators.maxLength(1000)]],
          recordedAt: [ this.isUpdate()?this.data.studentNote.recordedAt:'',[Validators.required,this.dateBetweenValidator()]],
          semesterId:[],
          semester:[]
      }
    );
    this.form.patchValue({
      type:this.isUpdate()?this.data.studentNote.type:'1',
      description:this.isUpdate()?this.data.studentNote.description:'', 
      recordedAt:this.isUpdate()?this.data.studentNote.recordedAt:''});
    this.form.get('semester')?.valueChanges.subscribe(value => {
      if(this.form.get("semester")?.value){
        this.form.get('recordedAt')?.enable();
        
      }else{
        this.form.get('recordedAt')?.disable();
      }
    })

    this.loading.set(false);
  }
  
  // ##################### Validations #####################
  dateBetweenValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) return null; 

      let minDate = this.form.get("semester")?.value.startDate
      let maxDate = this.form.get("semester")?.value.endDate
      

      if (!minDate || !maxDate) {
        return { failedSemesterLoading: true };
      }

      const inputTime = new Date(this.formatService.ToDateOnly(value));
      inputTime.setHours(0, 0, 0, 0);
      const minTime = new Date(minDate);
      minTime.setHours(0, 0, 0, 0);
      const maxTime = new Date(maxDate);
      maxTime.setHours(0, 0, 0, 0);
      ({inputTime, minTime, maxTime});
      if (inputTime >= minTime && inputTime <= maxTime) {
        return inputTime> new Date()? { greaterThanDate:true } : null;
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
      this.updateStudentNote();
    }else{
      this.addPeriod();    
    }
    
    this.loading.set(false);
  }

addPeriod(){
  
  this.studentNoteEndpoints.add(
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
          isReleased: false,
          recordedAt: this.form.value.recordedAt,
          type: this.form.value.type,
          isSolved: false,
          recordedBy: this.authService.getAuth()?.id, // Fixed,
          releasedAt: null,
          solvedAt: null
        } as NoteItem;
        this.dialogRef.close({
          data
        });
      },
      error: (error) => {
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
      }
    });
  }


  updateStudentNote(){
    this.studentNoteEndpoints.update(
      this.data.studentNote.id,
      this.form.value.type,
      this.form.value.description,
      this.formatService.ToDateOnly(this.form.value.recordedAt))
      .subscribe({
        next: success=>{
          this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
          const data = {
            id:success.id,
            description: this.form.value.description,
            isReleased: this.data.studentNote.isReleased,
            recordedAt: this.form.value.recordedAt,
            type: this.form.value.type,
            isSolved: this.data.studentNote.isSolved,
            recordedBy: this.data.studentNote.recordedBy,
            releasedAt: this.data.studentNote.releasedAt,
            solvedAt: this.data.studentNote.solvedAt
            } as NoteItem;
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
    return this.data && this.data.studentNote && this.data.studentNote != null ;
  }
}

