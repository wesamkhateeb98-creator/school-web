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
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpHelper } from "../../../../../../core/services/http-helper";
import { MutateResponse } from "../../../../../shared/model/mutate-response";
import { errorMatSnackbarConfig, successMatSnackbarConfig } from "../../../../../../core/consts";
import { AgeGroupViewModel } from "../../model/age-group-view-model";

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
    MatDatepickerModule
],
  providers:[provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-age-group-dialog.html',
})
export class AddAgeGroupDialog {
  loading = signal<boolean>(false);
  form!: FormGroup;
  key:string = crypto.randomUUID();

  data = inject(MAT_DIALOG_DATA);


  constructor(
    public dialogRef:MatDialogRef<AddAgeGroupDialog>,
    public language:Language,
    public responsiveScreen:ResponsiveScreen,
    public fb: FormBuilder,
    public http:HttpHelper,
    public matSnackBar:MatSnackBar
  ){
    this.form = this.fb.group(
      {
        name: [ this.isUpdate()?this.data.ageGroup.name:'', [Validators.required, Validators.minLength(3)]],
        sortOrder: [ this.isUpdate()?this.data.ageGroup.sortOrder:0, [Validators.required, Validators.min(0)]],
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
    const { name, sortOrder } = this.form.value;
    this.http.post<MutateResponse>("age-group",{
      key: this.key,
      name,
      sortOrder,
    }).subscribe({
      next: (success) => {
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        const data = new AgeGroupViewModel(success.id, name, sortOrder, new Date());
        this.dialogRef.close({ data });
      },
      error: (error) => {
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
      }
    });
  }

  updateAcademicYear(){
    const { name, sortOrder } = this.form.value;
    this.http.put<MutateResponse>("age-group/" + this.data.ageGroup.id,{
      name,
      sortOrder,
    }).subscribe({
      next: success => {
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
        const data = new AgeGroupViewModel(success.id, name, sortOrder, this.data.ageGroup.createdAt);
        this.dialogRef.close({ data });
      },
      error: error => {
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
      }
    });
  }

  isUpdate () : boolean{
    return this.data && this.data.ageGroup && this.data.ageGroup != null ;
  }

}

