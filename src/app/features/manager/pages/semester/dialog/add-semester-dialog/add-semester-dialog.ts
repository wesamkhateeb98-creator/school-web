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
import { ErrorTitleComponent } from "../../../../../shared/components/error-title-component/error-title-component";
import { SemesterEndpoints } from "../../../../endpoints/semester-endpoints";

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
    public semesterEndpoints: SemesterEndpoints
  ){
    this.form = this.fb.group(
      {
        name: [ this.isUpdate()?this.data.semester.name:'', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
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
    const data = this.semesterEndpoints.add(
      this.key,
      this.form.get('name')?.value
    )
    if(data != null){
      this.dialogRef.close({
        data
      });
    }
  }


  updateAcademicYear(){
    const data = this.semesterEndpoints.update(
      this.data.semester.id,
      this.form.get('name')?.value
    );
    if(data != null){
      this.dialogRef.close({
        data
      });
    }
  }

  isUpdate () : boolean{
    return this.data && this.data.semester && this.data.semester != null ;
  }

}

