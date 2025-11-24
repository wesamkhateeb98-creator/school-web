import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Language } from "../../../../../../core/services/language";
import { ResponsiveScreen } from "../../../../../../core/services/responsive-screen";
import { startDateMustLessEndDateValidator } from "../../../../../../core/validator/validator";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpHelper } from "../../../../../../core/services/http-helper";
import { MutateResponse } from "../../../../view-model/mutate-response";
import { errorMatSnackbarConfig, successMatSnackbarConfig } from "../../../../../../core/consts";
import { yearMonthDay } from "../../../../../../core/formats/date-format";
import { SemesterViewModel } from "../../model/semester-view-model";
import { ErrorTitleComponent } from "../../../../../shared/components/error-title-component/error-title-component";

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
    ErrorTitleComponent
],
  providers:[provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-semester-dialog.html',
  styleUrl: './add-semester-dialog.scss',
})
export class AddSemesterDialog {
  loading = signal<boolean>(false);
  form!: FormGroup;
  key:string = crypto.randomUUID();

  data = inject(MAT_DIALOG_DATA);


  constructor(
    public dialogRef:MatDialogRef<AddSemesterDialog>,
    public language:Language,
    public responsiveScreen:ResponsiveScreen,
    public fb: FormBuilder,
    public http:HttpHelper,
    public matSnackBar:MatSnackBar
  ){
    this.form = this.fb.group(
      {
        name: [ this.isUpdate()?this.data.semester.name:'', [Validators.required, Validators.minLength(3)]],
        startDate: [this.isUpdate()?this.data.semester.startDate:'', [Validators.required]],
        endDate: [this.isUpdate()?this.data.semester.endDate:'', [Validators.required]],
      },
      {
        validators: [startDateMustLessEndDateValidator]
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  submit(){
    if(!this.form.valid)
      return;
    
    this.loading.set(true);

    if(this.isUpdate()){
      this.updateAcademicYear();
    }else{
      this.addAcademicYear();    
    }
    
    this.loading.set(false);
  }

addAcademicYear(){
    this.http.post<MutateResponse>("semester",{
      key:this.key,
      name:this.form.get('name')?.value,
      startDate:yearMonthDay( this.form.get('startDate')?.value),
      endDate:yearMonthDay(this.form.get('endDate')?.value),
      academicYearId: this.data.academicYearId,
    }).subscribe({
      next: (success) => {
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig);
        const data = new SemesterViewModel(
          success.id,
          this.form.get('name')?.value,
          this.form.get('startDate')?.value,
          this.form.get('endDate')?.value,
          new Date());
        // this.data.ChangeAction(data);
        this.dialogRef.close({
          data
        });
      },
      error: (error) => {
        this.matSnackBar.open(error.error.Title, this.language.transform('close'), errorMatSnackbarConfig);
      }
    });
  }


  updateAcademicYear(){
    this.http.put<MutateResponse>("semester/" + this.data.semester.id,{
      name:this.form.get('name')?.value,
      startDate:yearMonthDay( this.form.get('startDate')?.value),
      endDate:yearMonthDay(this.form.get('endDate')?.value),
      academicYearId: this.data.academicYearId,
    }).subscribe({
      next: success=>{
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig);
        const data = new SemesterViewModel(
          success.id,
          this.form.get('name')?.value,
          this.form.get('startDate')?.value,
          this.form.get('endDate')?.value,
          new Date());
        // this.data.ChangeAction(data);
        this.dialogRef.close({
          data
        });
      },
      error: error=>{
        this.matSnackBar.open(error.error.Title, this.language.transform('close'), errorMatSnackbarConfig);
      }
  });
  }

  isUpdate () : boolean{
    return this.data && this.data.semester && this.data.semester != null ;
  }

}

