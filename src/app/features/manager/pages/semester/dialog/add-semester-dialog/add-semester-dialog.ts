import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
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

  constructor(
    public dialogRef:MatDialogRef<AddSemesterDialog>,
    public language:Language,
    public managerState:ManagerStateService,
    public responsiveScreen:ResponsiveScreen,
    public fb: FormBuilder
  ){
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
      },
      {
        validators: [startDateMustLessEndDateValidator]
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  async addSemester(){
    if(!this.form.valid){
      
      return;
    }
      
    console.log("123");
    this.loading.set(true);
    await new Promise(resolve => setTimeout(resolve, 2000))
    this.loading.set(false);
    console.log("123");

    this.dialogRef.close();
  }

}
function openSnackBar() {
  throw new Error("Function not implemented.");
}

