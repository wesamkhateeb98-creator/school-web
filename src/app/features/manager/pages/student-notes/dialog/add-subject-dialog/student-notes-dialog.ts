// import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
// import { MatButtonModule } from "@angular/material/button";
// import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
// import { MatFormFieldModule } from "@angular/material/form-field";
// import { MatGridListModule } from "@angular/material/grid-list";
// import { MatInputModule } from "@angular/material/input";
// import { MatProgressBarModule } from "@angular/material/progress-bar";
// import { Language } from "../../../../../../core/services/language";
// import { ResponsiveScreen } from "../../../../../../core/services/responsive-screen";
// import { provideNativeDateAdapter } from "@angular/material/core";
// import { MatDatepickerModule } from "@angular/material/datepicker";
// import { MatSnackBar } from "@angular/material/snack-bar";
// import { HttpHelper } from "../../../../../../core/services/http-helper";
// import { errorMatSnackbarConfig, successMatSnackbarConfig, time12hTo24, time24hTo12 } from "../../../../../../core/consts";
// import { ErrorTitleComponent } from "../../../../../shared/components/error-title-component/error-title-component";
// import { PeriodEndpoints } from "../../../../shared/endpoints/period-endpoint";
// import { PeriodModel } from "../../../../shared/endpoints/models/Period/period-model";
// import { MatTimepickerModule } from "@angular/material/timepicker";
// import { NgxMatTimepickerModule } from "ngx-mat-timepicker";
// import { fromTimeMustLessThanToTimeValidator } from "../../../../../../core/validator/validator";

// @Component({
//   selector: 'app-add-academic-year-dialog',
//   imports: [
//     MatButtonModule,
//     MatDialogTitle,
//     MatDialogContent,
//     MatDialogActions,
//     MatGridListModule,
//     MatFormFieldModule,
//     MatInputModule,
//     ReactiveFormsModule,
//     MatProgressBarModule,
//     MatDatepickerModule,
//     ErrorTitleComponent,
//     MatTimepickerModule,
//     NgxMatTimepickerModule
// ],
//   providers:[provideNativeDateAdapter()],
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   templateUrl: './student-notes-dialog.html',
// })

// export class StudentNotesDialog {
//   loading = signal<boolean>(false);
//   form!: FormGroup;
//   key:string = crypto.randomUUID();

//   data = inject(MAT_DIALOG_DATA);

//   constructor(
//     public dialogRef:MatDialogRef<StudentNotesDialog>,
//     public language:Language,
//     public responsiveScreen:ResponsiveScreen,
//     public fb: FormBuilder,
//     public http:HttpHelper,
//     public matSnackBar:MatSnackBar,
//     public periodEndpoints:PeriodEndpoints
//   ){
//     this.form = this.fb.group(
//       {
//         lessonNumber: [ this.isUpdate()?this.data.period.lessonNumber:'', [Validators.required, Validators.min(0),Validators.max(12)]],
//         fromTime: [ this.isUpdate()?this.data.period.fromTime:'', [Validators.required]],
//         toTime: [ this.isUpdate()?this.data.period.toTime:'', [Validators.required]],
//       },
//       {
//         validators:fromTimeMustLessThanToTimeValidator
//       }
//     );
//   }

//   onNoClick(): void {
//     this.dialogRef.close();
//   }
  
//   submit(){
//     if(!this.form.valid)
//       return;
    
//     this.loading.set(true);

//     if(this.isUpdate()){
//       this.updatePeriod();
//     }else{
//       this.addPeriod();    
//     }
    
//     this.loading.set(false);
//   }

// addPeriod(){
//   this.periodEndpoints.add(
//     this.key,
//     this.form.value.lessonNumber,
//     time12hTo24(this.form.value.fromTime as string),
//     time12hTo24(this.form.value.toTime as string)
//   )
//     .subscribe({
//       next: (success) => {
//         this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
//         const data = new PeriodModel(
//           success.id,
//           this.form.value.lessonNumber,
//           this.form.value.fromTime,
//           this.form.value.toTime,
//           new Date());
//         this.dialogRef.close({
//           data
//         });
//       },
//       error: (error) => {
//         this.matSnackBar.open(error.Title, this.language.transform('close'), errorMatSnackbarConfig(this.language));
//       }
//     });
//   }


//   updatePeriod(){
//     this.periodEndpoints.update(
//       this.data.period.id,
//       this.form.value.lessonNumber,
//       time12hTo24(this.form.value.fromTime as string),
//       time12hTo24(this.form.value.toTime as string))
//       .subscribe({
//         next: success=>{
//           this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
//           const data = new PeriodModel(
//             success.id,
//             this.form.value.lessonNumber,
//             this.form.value.fromTime,
//             this.form.value.toTime,
//             this.data.period.createdAt);
//           this.dialogRef.close({
//             data
//           });
//         },
//         error: error=>{
          
//           this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
//         }
//       });
//   }

//   isUpdate () : boolean{
//     return this.data && this.data.period && this.data.period != null ;
//   }
// }

