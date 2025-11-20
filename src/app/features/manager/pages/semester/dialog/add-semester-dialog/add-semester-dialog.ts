import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Language } from "../../../../../../core/services/language";
import { ManagerStateService } from "../../../../services/manager-state-service";
import { ResponsiveScreen } from "../../../../../../core/services/responsive-screen";
import { startDateMustLessEndDateValidator } from "../../../../../../core/validator/validator";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ErrorTitleComponent } from "../../../../../../shared/components/error-title-component/error-title-component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpHelper } from "../../../../../../core/services/http-helper";
import { MutateResponse } from "../../../../view-model/mutate-response";
import { AcademicYearViewModel } from "../../../academic-year/model/academic-year-view-model";
import { errorMatSnackbarConfig, successMatSnackbarConfig } from "../../../../../../core/consts";
import { yearMonthDay } from "../../../../../../core/formats/date-format";

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
    public managerState:ManagerStateService,
    public responsiveScreen:ResponsiveScreen,
    public fb: FormBuilder,
    public http:HttpHelper,
    public matSnackBar:MatSnackBar
  ){
    this.form = this.fb.group(
      {
        name: ['WEssss', [Validators.required, Validators.minLength(3)]],
        startDate: ['11-20-2025', [Validators.required]],
        endDate: ['11-21-2025', [Validators.required]],
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
        const data = new AcademicYearViewModel(success.id,this.form.get('academicYear')?.value,new Date());
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
    this.http.put<MutateResponse>("semester/" + this.data.semesterId,{
      name:this.form.get('name')?.value,
      startDate:this.form.get('startDate')?.value,
      endDate:this.form.get('endDate')?.value,
      academicYearId: this.data.academicYearId,
    }).subscribe({
      next: success=>{
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig);
        const data = new AcademicYearViewModel(success.id,this.form.get('academicYear')?.value,new Date());
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
    return this.data && this.data.item && this.data.item != null ;
  }

}

