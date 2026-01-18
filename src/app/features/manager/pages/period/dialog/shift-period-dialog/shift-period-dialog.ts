import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Language } from "../../../../../../core/services/language";
import { ResponsiveScreen } from "../../../../../../core/services/responsive-screen";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpHelper } from "../../../../../../core/services/http-helper";
import { errorMatSnackbarConfig, successMatSnackbarConfig, time12hTo24, time24hTo12 } from "../../../../../../core/consts";
import { ErrorTitleComponent } from "../../../../../shared/components/error-title-component/error-title-component";
import { PeriodEndpoints } from "../../../../shared/endpoints/period-endpoint";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { NgxMatTimepickerModule } from "ngx-mat-timepicker";
import { MatRadioModule } from "@angular/material/radio";
import { MatIconModule } from "@angular/material/icon";
import { MinutesAndHoursTimeValidator } from "../../../../../../core/validator/validator";

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
    ErrorTitleComponent,
    MatTimepickerModule,
    NgxMatTimepickerModule,
    MatRadioModule,
    MatIconModule
],
  providers:[provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shift-period-dialog.html',
  styles:`
    .example-radio-group {
      display: flex;
      flex-direction: column;
      margin: 15px 0;
      align-items: flex-start;
    }

    .example-radio-button {
      margin: 5px;
    }
  `
})
export class ShiftPeriodDialog {
  loading = signal<boolean>(false);
  
  form!: FormGroup;
  
  key:string = crypto.randomUUID();

  data = inject(MAT_DIALOG_DATA);

  constructor(
    public dialogRef:MatDialogRef<ShiftPeriodDialog>,
    public language:Language,
    public responsiveScreen:ResponsiveScreen,
    public fb: FormBuilder,
    public http:HttpHelper,
    public matSnackBar:MatSnackBar,
    public periodEndpoints:PeriodEndpoints
  ){
    this.form = this.fb.group(
      {
        hours: [ '1', ],
        minutes: [ '0', ],
        signPositive: [true]
      },
      {
          validators:[MinutesAndHoursTimeValidator]
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

    this.periodEndpoints.shift(
        `${this.form.value.hours}:${this.form.value.minutes}:00`,
        this.form.value.signPositive
    )
    .subscribe({
    next: (success) => {
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        this.dialogRef.close(true);
    },
    error: (error) => {
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
    }
    });
    
    this.loading.set(false);
  }

  isUpdate () : boolean{
    return this.data && this.data.period && this.data.period != null ;
  }

}

